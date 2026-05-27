/**
 * analytics.js
 * Pure utility functions for funnel metric calculations.
 * No framework dependencies – easy to unit test.
 */

/**
 * Returns the step-level conversion rate (proceeds / views).
 * @param {number} views
 * @param {number} proceeds
 * @returns {number} 0–100
 */
export function stepConversionRate(views, proceeds) {
  if (!views || views === 0) return 0
  return (proceeds / views) * 100
}

/**
 * Overall campaign conversion = last step proceeds / first step views.
 * @param {Array} steps
 * @returns {number} 0–100
 */
export function overallConversionRate(steps) {
  if (!steps || steps.length === 0) return 0
  const firstViews = steps[0].views
  const lastProceeds = steps[steps.length - 1].proceeds
  if (firstViews === 0) return 0
  return (lastProceeds / firstViews) * 100
}

/**
 * Calculates the absolute and percentage drop-off between consecutive steps.
 * Drop-off at step N = step[N].views - step[N].proceeds
 *                    (i.e. how many users did NOT continue from this step)
 *
 * Returns an array with one entry per step containing enriched data.
 * @param {Array} steps
 * @returns {Array}
 */
export function enrichSteps(steps) {
  return steps.map((step, index) => {
    const convRate = stepConversionRate(step.views, step.proceeds)
    const droppedAbsolute = step.views - step.proceeds
    const dropOffRate = step.views > 0 ? (droppedAbsolute / step.views) * 100 : 0

    // Relative width for the funnel bar visualization (% of first step views)
    const firstViews = steps[0].views
    const barWidth = firstViews > 0 ? (step.views / firstViews) * 100 : 100

    return {
      ...step,
      stepIndex: index,
      convRate: round(convRate),
      droppedAbsolute,
      dropOffRate: round(dropOffRate),
      barWidth: round(barWidth),
      isLast: index === steps.length - 1,
    }
  })
}

/**
 * Finds the step with the biggest absolute drop-off.
 * @param {Array} enrichedSteps - output of enrichSteps()
 * @returns {Object|null}
 */
export function worstStep(enrichedSteps) {
  if (!enrichedSteps || enrichedSteps.length === 0) return null;

  // Exclude the last step (no "next step" to drop off to)
  const candidates = enrichedSteps.filter((s) => !s.isLast);
  if (candidates.length === 0) return null;

  // Find the step with the highest percentage drop-off rate
  return candidates.reduce((worst, step) =>
    step.dropOffRate > worst.dropOffRate ? step : worst,
  );
}

/**
 * Generates rule-based, plain-language insights for a campaign.
 * @param {Array} enrichedSteps
 * @param {Object} worst - output of worstStep()
 * @returns {Array<string>}
 */
export function generateInsights(enrichedSteps, worst) {
  const insights = [];
  if (!enrichedSteps || enrichedSteps.length === 0) return insights;

  // Insight 1: Worst drop-off step (Context-aware: dynamic based on type)
  if (worst) {
    const dropPct = worst.dropOffRate;

    if (dropPct >= 70) {
      if (worst.type === "exit-intent" || worst.type === "teaser") {
        insights.push(
          `🚨 "${worst.name}" loses ${dropPct}% of visitors — a critical bottleneck. Since this is a visual step without forms, focus optimization on the psychological trigger: test a higher discount, create urgency, or refine trigger timing.`,
        );
      } else {
        insights.push(
          `🚨 "${worst.name}" loses ${dropPct}% of visitors — a critical bottleneck. Consider simplifying this step or reducing friction (fewer form fields, clearer call-to-action).`,
        );
      }
    } else if (dropPct >= 40) {
      insights.push(
        `⚠️ "${worst.name}" has a ${dropPct}% drop-off rate. A/B test the headline, main benefit, or offer on this step to improve initial engagement.`,
      );
    } else {
      insights.push(
        `✅ "${worst.name}" is your weakest step with ${dropPct}% drop-off — but it's within a healthy range. Small copy tweaks could still push conversions higher.`,
      );
    }
  }

  // Insight 2: Email step specific advice (Smart: checkbox vs simple email)
  const emailStep = enrichedSteps.find((s) => s.type === "email");
  if (emailStep && emailStep.dropOffRate >= 50) {
    // Ha a leírásban benne van, hogy több mező/checkbox van (mint a 3. kampányban)
    const hasPreferences =
      emailStep.description?.toLowerCase().includes("preference") ||
      emailStep.description?.toLowerCase().includes("checkbox");

    if (hasPreferences) {
      insights.push(
        `📧 The preferences/checkboxes on "${emailStep.name}" might be causing friction (${emailStep.dropOffRate}% lost). Test moving preference selection to the post-signup screen to keep the initial process a clean, single-field form.`,
      );
    } else {
      insights.push(
        `📧 Email forms typically see high friction. Try adding social proof ("Join 10,000+ subscribers"), removing non-essential elements, or offering a stronger lead magnet.`,
      );
    }
  }

  // Insight 3: Coupon step specific advice (For 2-step funnels like Cart Saver)
  const couponStep = enrichedSteps.find((s) => s.type === "coupon");
  if (couponStep) {
    insights.push(
      `💸 To maximize the ${couponStep.convRate}% success on "${couponStep.name}", ensure the coupon code is auto-applied at checkout so users don't drop off during manual copying.`,
    );
  }

  // Insight 4: First step (teaser) performance (Smart: checks if it's the absolute worst)
  const teaser = enrichedSteps[0];
  if (teaser && !couponStep) {
    // Csak akkor fut le, ha nem a 2-lépéses kuponos kampányról van szó
    const isTeaserTheWorstAbsolute =
      worst && worst.id === teaser.id && teaser.views - teaser.proceeds > 5000;

    if (teaser.convRate < 20) {
      insights.push(
        `👁️ Only ${teaser.convRate}% of visitors engage with the first step. The initial offer or placement needs work — test a different layout, sticky bar vs popup, or behavioral triggers.`,
      );
    } else if (teaser.convRate >= 20 && isTeaserTheWorstAbsolute) {
      insights.push(
        `📈 While Step 1 converts ${teaser.convRate}%, its high traffic volume means it leaks the most total users. Prioritize testing headlines here to fill the top of the funnel.`,
      );
    } else if (teaser.convRate >= 20) {
      insights.push(
        `👍 Your first step converts ${teaser.convRate}% of visitors — solid initial engagement. Focus conversion efforts on optimizing the subsequent steps.`,
      );
    }
  }

  // Insight 5: Success/last step completion
  const lastStep = enrichedSteps[enrichedSteps.length - 1];
  if (lastStep && lastStep.convRate < 90 && lastStep.type === "success") {
    insights.push(
      `🎯 ${100 - lastStep.convRate}% of users who reach the final step still don't complete. Ensure the success screen has a clear next action (e.g. "Copy coupon" or "Shop Now" button).`,
    );
  }

  // Visszaadjuk a legrelevánsabb 3 darabot
  return insights.slice(0, 3);
}

function round(num, decimals = 1) {
  return Math.round(num * 10 ** decimals) / 10 ** decimals
}
