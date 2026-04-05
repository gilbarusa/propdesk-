// ══════════════════════════════════════════════════════
//  WILLOW REPLY KNOWLEDGE BASE
//  Learned from historical Airbnb message patterns
//  Used by the suggestion engine to draft replies
// ══════════════════════════════════════════════════════

const WILLOW_KB = {

  // ── Company Info ──
  company: {
    name: 'Willow Partnership, LLC',
    phone: '267-865-0001',
    email: 'general@willowpa.com',
    hours: '9 AM – 7 PM',
    afterHours: 'After hours, only urgent matters will be addressed. All other requests will be handled the next business day.',
    emergency: 'Dial 911',
    signature: `Willow Partnership, LLC\n+12678650001\ngeneral@willowpa.com`
  },

  // ── Properties ──
  properties: {
    chelbourne: {
      address: '46 Township Line Rd, Elkins Park, PA – Chelbourne Plaza',
      entrancePin: '4545',
      wifi: { network: 'Chelbourne 46', password: 'W2678650001' },
      altWifi: { network: 'WillowPa', password: '2678650001' },
      laundry: 'CALECO CleanMobile App or purchase/reload a laundry card at the kiosk in the lobby',
      parking: 'A parking tag has been left for your vehicle. Please display the tag immediately. Note: Do not park in the "Guest Parking" area.',
      parkingExtra: 'https://parking.willowpa.com/ select "46 Township" from the list, password: 1234',
      trash: 'Trash bins are located outside the building at each corner. Please do not leave trash in the hallways, staircases, or outside your door.',
      floors: { '1st': '1', '2nd': '2', '3rd': '3' },
      laundryRoomPattern: (apt) => {
        const floor = apt.charAt(0);
        return `in front of apartments ${floor}18 and ${floor}11`;
      }
    },
    central: {
      address: '426 Central Ave, Cheltenham, PA',
      entranceCode: '#4646#',
      lockboxCode: '4646 (if that doesn\'t work, try 4545)',
      wifi: { network: 'Central', password: 'C2678650001' },
      laundry: 'Laundry room is in the basement. Use the other key to unlock the door on the right side of the intercom; the basement door will be to your left. Machines require quarters.',
      parking: 'Park in your assigned spot on the side of the building.',
      trash: 'Trash bins are located outside, around the building.'
    },
    valleyRd: {
      address: '431 Valley Rd, Cheltenham PA 19012',
      wifi: { network: 'Valley', password: 'V2678650001' },
    },
    killington: {
      name: 'Mt Green',
      location: 'Killington, VT'
    }
  },

  // ── Message Templates ──
  templates: {

    bookingConfirmation: (guestName, listingName, checkinDate) =>
      `Hello ${guestName}, Thank you for booking with us!\n\nWe will send check-in information (address, access details, door code, etc.) 1 day before your reservation ${checkinDate}.\n\nThank you for booking ${listingName}! We are so excited to host your group and we are dedicated to providing a 5-star experience. We will be in contact with you prior to your stay.\n\nIf there is anything we can do to make your stay more comfortable, please let us know as soon as possible. While we cannot promise anything, we will certainly do our best to accommodate your needs. :)\n\nTo ensure a smooth and seamless check-in experience, please take a moment to complete the following:\n\nPre-Arrival Form: [PRE_ARRIVAL_LINK]\nRental Agreement: [RENTAL_AGREEMENT_LINK]\n\nPlease note that any delay in submitting these forms may result in a delay in receiving your check-in information.\n\nWe appreciate your cooperation and look forward to hosting you!\n\nWe look forward to hosting you and thanks again for booking with Willow Partnership, LLC.\n\nSee you soon!\nWillow Partnership, LLC\n+12678650001\ngeneral@willowpa.com`,

    extensionOffer: (guestName) =>
      `Hi ${guestName}! I hope you're enjoying your stay! I wanted to reach out and see if you need to extend your reservation.\n\nBest regards`,

    longTermMention: (guestName, checkinDate) =>
      `Dear ${guestName},\n\nJust a quick note to let you know that this apartment is available for long-term rental, either furnished or unfurnished. Feel free to reach out if you're interested or would like more information.`,

    checkoutReminder: (guestName) =>
      `Hi ${guestName}, just a friendly reminder that your checkout is tomorrow at 11:00 AM.\n\nBefore you leave, please:\n- Take out the trash\n- Run the dishwasher if used\n- Leave the keys on the kitchen counter\n\nWe hope you enjoyed your stay! If you had a great experience, we'd really appreciate a review.\n\nThank you for staying with us!`,

    extensionDeclineResponse: (guestName) =>
      `Dear ${guestName},\n\nWe are delighted to hear that you are enjoying your stay and appreciate your feedback about the location. If you have any questions or need assistance during your stay, please don't hesitate to let us know. Thank you for choosing to stay with us, and we hope you continue to have a wonderful experience!\n\nBest regards,`,

    reviewThankYou: (guestName) =>
      `Thank you so much for the wonderful review, ${guestName}! We truly enjoyed hosting you and are thrilled you had a great experience. We hope to welcome you back again soon!`,
  },

  // ── Intent Detection Patterns ──
  // Each pattern: { keywords, category, subcategory, confidence }
  intents: [
    // ── Maintenance / Issues ──
    { keywords: ['heat', 'heating', 'cold air', 'thermostat', 'temperature', 'hvac', 'ac', 'air conditioning', 'warm', 'hot'],
      category: 'maintenance', subcategory: 'hvac', confidence: 0.9 },
    { keywords: ['wifi', 'wi-fi', 'internet', 'network', 'signal', 'connect', 'no connection', 'slow internet'],
      category: 'maintenance', subcategory: 'wifi', confidence: 0.9 },
    { keywords: ['water', 'leak', 'plumbing', 'toilet', 'faucet', 'drain', 'clog', 'shower', 'hot water'],
      category: 'maintenance', subcategory: 'plumbing', confidence: 0.85 },
    { keywords: ['door', 'lock', 'key', 'code', 'access', 'locked out', 'can\'t get in', 'won\'t open'],
      category: 'maintenance', subcategory: 'access', confidence: 0.85 },
    { keywords: ['light', 'bulb', 'electricity', 'power', 'outlet', 'switch'],
      category: 'maintenance', subcategory: 'electrical', confidence: 0.8 },
    { keywords: ['noise', 'loud', 'neighbor', 'party', 'music', 'barking'],
      category: 'maintenance', subcategory: 'noise', confidence: 0.8 },
    { keywords: ['broken', 'damaged', 'not working', 'doesn\'t work', 'issue', 'problem', 'fix'],
      category: 'maintenance', subcategory: 'general', confidence: 0.7 },
    { keywords: ['clean', 'dirty', 'stain', 'mess', 'vacuum', 'dust'],
      category: 'maintenance', subcategory: 'cleaning', confidence: 0.75 },

    // ── Booking / Stay ──
    { keywords: ['extend', 'extension', 'stay longer', 'additional nights', 'more nights'],
      category: 'booking', subcategory: 'extension', confidence: 0.9 },
    { keywords: ['cancel', 'cancellation', 'refund', 'money back'],
      category: 'booking', subcategory: 'cancellation', confidence: 0.9 },
    { keywords: ['change', 'modify', 'dates', 'new dates', 'reschedule'],
      category: 'booking', subcategory: 'modification', confidence: 0.85 },
    { keywords: ['check in', 'checkin', 'check-in', 'arrival', 'arrive', 'getting there', 'directions'],
      category: 'booking', subcategory: 'checkin', confidence: 0.85 },
    { keywords: ['check out', 'checkout', 'check-out', 'leaving', 'departure'],
      category: 'booking', subcategory: 'checkout', confidence: 0.85 },
    { keywords: ['long term', 'long-term', 'lease', 'rent', 'monthly', 'year', 'permanent'],
      category: 'booking', subcategory: 'longterm', confidence: 0.85 },

    // ── Logistics ──
    { keywords: ['parking', 'car', 'vehicle', 'park', 'spot', 'tag', 'tow', 'towed'],
      category: 'logistics', subcategory: 'parking', confidence: 0.9 },
    { keywords: ['package', 'delivery', 'mail', 'amazon', 'ups', 'fedex', 'usps'],
      category: 'logistics', subcategory: 'packages', confidence: 0.85 },
    { keywords: ['laundry', 'washer', 'dryer', 'wash', 'caleco'],
      category: 'logistics', subcategory: 'laundry', confidence: 0.85 },
    { keywords: ['trash', 'garbage', 'recycling', 'bins'],
      category: 'logistics', subcategory: 'trash', confidence: 0.8 },
    { keywords: ['pet', 'dog', 'cat', 'animal'],
      category: 'logistics', subcategory: 'pets', confidence: 0.85 },
    { keywords: ['extra key', 'second key', 'additional key', 'two keys'],
      category: 'logistics', subcategory: 'keys', confidence: 0.85 },

    // ── Social / General ──
    { keywords: ['thank', 'thanks', 'appreciate', 'grateful'],
      category: 'social', subcategory: 'thanks', confidence: 0.6 },
    { keywords: ['hello', 'hi', 'good morning', 'good afternoon', 'good evening', 'good night', 'hey'],
      category: 'social', subcategory: 'greeting', confidence: 0.5 },
    { keywords: ['review', 'rating', 'stars', 'feedback'],
      category: 'social', subcategory: 'review', confidence: 0.75 },
    { keywords: ['how are you', 'hope you', 'doing well'],
      category: 'social', subcategory: 'pleasantry', confidence: 0.4 },
    { keywords: ['utility', 'utilities', 'electric', 'gas', 'bill'],
      category: 'logistics', subcategory: 'utilities', confidence: 0.8 },
  ],

  // ── Response Templates by Category ──
  responses: {

    maintenance: {
      hvac: {
        initial: `Thank you for letting us know, we will send a technician to check.`,
        followUp: `Our technician was there, but nobody opened the door. Can he use the key? Or should he come later?`,
        resolved: (issue) => `The ${issue} has been fixed. Please let us know if you experience any further issues.`,
        afterHours: `Thank you for letting us know. Our maintenance team will address this first thing in the morning. If the situation becomes urgent, please text us at 267-865-0001.`
      },
      wifi: {
        initial: `Good night! Please send us a screenshot of available networks.\n\nIf you have a network WillowPa try it, password 2678650001`,
        sendTechnician: `We will send someone to help. Are you home now?`,
        resolved: `The WiFi connection has been restored. Please let us know if you have any further issues.`
      },
      access: {
        wrongCode: (correctCode) => `We apologize for the inconvenience. The correct code is ${correctCode}. Please try again and let us know if it works.`,
        lockout: `We're sorry about the trouble. We're sending someone right away to help you get in.`,
      },
      general: {
        acknowledge: `Thank you for letting us know. We will look into this and get back to you shortly.`,
        sendTechnician: `We will send a technician to check. Will someone be home, or can they use the key?`,
        resolved: `The issue has been resolved. Please let us know if you need anything else.`
      }
    },

    booking: {
      extension: {
        offer: (guestName) => `Hi ${guestName}! I hope you're enjoying your stay! I wanted to reach out and see if you need to extend your reservation.\n\nBest regards`,
        accepted: `Great! We'll send you the updated reservation details shortly.`,
        declined: (guestName) => `Dear ${guestName},\n\nWe are delighted to hear that you are enjoying your stay and appreciate your feedback. If you have any questions or need assistance during your stay, please don't hesitate to let us know. Thank you for choosing to stay with us!\n\nBest regards,`
      },
      cancellation: {
        policyExplanation: `Thank you for your kind words; we are thrilled to hear that you are enjoying your stay with us.\n\nRegarding your request for cancellation and a refund, we regret to inform you that our cancellation policy typically does not allow for refunds for days that are already reserved. However, we understand your situation.\n\nWe encourage you to reach out to us directly with your reservation details, and we will do our best to explore any possible options to accommodate your needs.\n\nWe appreciate your understanding. Please let us know if there is anything else we can assist you with during your stay.`
      },
      checkin: {
        willSend: `We will send check-in information (address, access details, door code, etc.) 1 day before your reservation.`,
        sameDayCoordinate: (time) => `We just had a check out and we are looking if we can have cleaners available. We will get back to you in a few minutes.\n\nThe apartment will be ready for check-in at ${time}.`
      },
      longterm: {
        interested: `We will check with the owner regarding long-term rental and will get back to you!`,
        referToOffice: (guestName) => `${guestName}, after your check in, please reach out the office to discuss the long term. Someone will be happy to assist you.`
      }
    },

    logistics: {
      parking: {
        additionalSpot: `Please visit https://parking.willowpa.com/ select "46 Township" from the list, and enter the password: 1234.\n\nAs soon as your payment is processed, we will issue a second parking tag for your use.\n\nLet us know if you have any issues accessing the site or completing the process.`,
        tagInfo: `A parking tag has been left for your vehicle. Please display the tag immediately, as vehicles without a tag are being towed.`,
        noTag: `It's fine, we have your information in a system.`
      },
      packages: {
        canReceive: `Yes, you can receive packages. The address is [PROPERTY_ADDRESS].`
      },
      pets: {
        askDescribe: `Can you please describe the pet - Type and breed?`,
        approve: `Thanks for your reply. We will approve your request; however, the dog cannot be left alone in the apartment and must not cause any disturbance to neighbors. We know this may sound strict, but in an apartment building we need to make sure everyone can enjoy their stay peacefully.\n\nWe will send the check-in information the night before your arrival.`
      },
      utilities: {
        notResponsible: `You are not responsible for utilities.`
      },
      keys: {
        secondKey: `Sure, we will get a second key for you!`
      },
      laundry: {
        chelbourne: `Laundry rooms are located on your floor. You can use the CALECO CleanMobile App or purchase and reload a laundry card at the kiosk in the lobby.`,
        central: `The laundry room is in the basement. Machines require quarters to operate.`
      }
    },

    social: {
      thanks: {
        reply: `You're welcome! Let us know if you need anything else.`,
        stayRelated: `You're welcome! We hope you enjoy your stay. Don't hesitate to reach out if you need anything.`
      },
      greeting: {
        reply: `Hello! How can we help you?`,
        morning: `Good morning! How can we help you today?`
      },
      review: {
        askForReview: `We hope you enjoyed your stay! If you had a great experience, we'd really appreciate a review. It helps future guests and our team. Thank you!`,
        thankForReview: (guestName) => `Thank you so much for the wonderful review, ${guestName}! We truly enjoyed hosting you and are thrilled you had a great experience. We hope to welcome you back again soon!`
      }
    },

    // ── Pre-arrival form issues ──
    preArrival: {
      formDown: `Thank you for bringing this to our attention. We apologize for the inconvenience you are experiencing with the pre-arrival form. While the website is undergoing maintenance, we recommend trying to access it again after some time. We appreciate your understanding and patience.`,
      resendLink: (link) => `Pre Arrival form\n${link}`
    }
  },

  // ── Tone Guidelines ──
  tone: {
    voice: 'We', // Always use "We" not "I"
    style: 'Professional but warm',
    emojis: 'Occasional :) and ❤️ — sparingly',
    signOff: ['Best regards', 'Thank you!', 'See you soon!'],
    doNot: [
      'Never use slang or overly casual language',
      'Never promise specific outcomes for refunds',
      'Never share other guests information',
      'Never provide legal advice'
    ]
  }
};

// ══════════════════════════════════════════════════════
//  REPLY SUGGESTION ENGINE
// ══════════════════════════════════════════════════════

const WillowReplyBot = {

  /**
   * Analyze incoming message and detect intent
   * @param {string} message - The guest message text
   * @returns {Array<{category, subcategory, confidence, keywords}>}
   */
  detectIntents(message) {
    const lower = message.toLowerCase();
    const matches = [];

    for (const intent of WILLOW_KB.intents) {
      const matchedKeywords = intent.keywords.filter(kw => lower.includes(kw));
      if (matchedKeywords.length > 0) {
        matches.push({
          category: intent.category,
          subcategory: intent.subcategory,
          confidence: intent.confidence * (matchedKeywords.length / intent.keywords.length + 0.5),
          matchedKeywords
        });
      }
    }

    // Sort by confidence descending
    matches.sort((a, b) => b.confidence - a.confidence);
    return matches;
  },

  /**
   * Get the best response suggestion for a guest message
   * @param {string} guestMessage - The latest guest message
   * @param {Object} context - { guestName, property, unit, checkin, checkout, status, platform, confirmCode, threadId }
   * @returns {Object} { suggestion, confidence, category, subcategory, needsReview: true }
   */
  suggestReply(guestMessage, context = {}) {
    const intents = this.detectIntents(guestMessage);
    if (intents.length === 0) {
      return {
        suggestion: `Thank you for your message. We will look into this and get back to you shortly.`,
        confidence: 0.3,
        category: 'unknown',
        subcategory: 'unknown',
        needsReview: true,
        reasoning: 'No clear intent detected — generic acknowledgment'
      };
    }

    const top = intents[0];
    let suggestion = '';
    let reasoning = '';

    // ── Maintenance ──
    if (top.category === 'maintenance') {
      if (top.subcategory === 'hvac') {
        suggestion = WILLOW_KB.responses.maintenance.hvac.initial;
        reasoning = 'Guest reporting HVAC issue — standard technician dispatch';
      } else if (top.subcategory === 'wifi') {
        suggestion = WILLOW_KB.responses.maintenance.wifi.initial;
        reasoning = 'Guest reporting WiFi issue — ask for screenshot + suggest WillowPa network';
      } else if (top.subcategory === 'access') {
        suggestion = WILLOW_KB.responses.maintenance.access.lockout;
        reasoning = 'Guest reporting access/lock issue — sending help';
      } else {
        suggestion = WILLOW_KB.responses.maintenance.general.sendTechnician;
        reasoning = 'General maintenance issue — offer technician';
      }
    }

    // ── Booking ──
    else if (top.category === 'booking') {
      if (top.subcategory === 'extension') {
        suggestion = `Great! We'd love to have you stay longer. Let us check availability and we'll get back to you with updated pricing.`;
        reasoning = 'Guest interested in extending — check availability';
      } else if (top.subcategory === 'cancellation') {
        suggestion = WILLOW_KB.responses.booking.cancellation.policyExplanation;
        reasoning = 'Guest asking about cancellation/refund — policy explanation with empathy';
      } else if (top.subcategory === 'checkin') {
        suggestion = WILLOW_KB.responses.booking.checkin.willSend;
        reasoning = 'Guest asking about check-in — standard response';
      } else if (top.subcategory === 'checkout') {
        suggestion = WILLOW_KB.templates.checkoutReminder(context.guestName || 'Guest');
        reasoning = 'Guest asking about checkout — send reminder template';
      } else if (top.subcategory === 'longterm') {
        suggestion = WILLOW_KB.responses.booking.longterm.interested;
        reasoning = 'Guest interested in long-term — will check with owner';
      } else if (top.subcategory === 'modification') {
        suggestion = `Thank you for reaching out. We'll review your request and get back to you shortly. If you'd like to submit a formal change request, you can do so through the Airbnb app.`;
        reasoning = 'Guest requesting date change — acknowledge + guide to formal process';
      }
    }

    // ── Logistics ──
    else if (top.category === 'logistics') {
      if (top.subcategory === 'parking') {
        if (guestMessage.toLowerCase().includes('additional') || guestMessage.toLowerCase().includes('second') || guestMessage.toLowerCase().includes('two') || guestMessage.toLowerCase().includes('another')) {
          suggestion = WILLOW_KB.responses.logistics.parking.additionalSpot;
          reasoning = 'Guest needs additional parking — direct to parking portal';
        } else {
          suggestion = WILLOW_KB.responses.logistics.parking.tagInfo;
          reasoning = 'General parking question — tag info';
        }
      } else if (top.subcategory === 'packages') {
        suggestion = WILLOW_KB.responses.logistics.packages.canReceive;
        reasoning = 'Guest asking about packages — yes, can receive';
      } else if (top.subcategory === 'pets') {
        suggestion = WILLOW_KB.responses.logistics.pets.askDescribe;
        reasoning = 'Guest mentioning pet — ask for details before approving';
      } else if (top.subcategory === 'utilities') {
        suggestion = WILLOW_KB.responses.logistics.utilities.notResponsible;
        reasoning = 'Guest asking about utilities — not responsible';
      } else if (top.subcategory === 'keys') {
        suggestion = WILLOW_KB.responses.logistics.keys.secondKey;
        reasoning = 'Guest requesting extra key — we can provide';
      } else if (top.subcategory === 'laundry') {
        suggestion = WILLOW_KB.responses.logistics.laundry.chelbourne;
        reasoning = 'Guest asking about laundry — CALECO app info';
      } else if (top.subcategory === 'trash') {
        suggestion = WILLOW_KB.properties.chelbourne.trash;
        reasoning = 'Guest asking about trash — bin locations';
      }
    }

    // ── Social ──
    else if (top.category === 'social') {
      if (top.subcategory === 'thanks') {
        suggestion = WILLOW_KB.responses.social.thanks.stayRelated;
        reasoning = 'Guest saying thanks — warm acknowledgment';
      } else if (top.subcategory === 'greeting') {
        suggestion = WILLOW_KB.responses.social.greeting.reply;
        reasoning = 'Guest greeting — respond and ask how to help';
      } else if (top.subcategory === 'review') {
        suggestion = WILLOW_KB.responses.social.review.thankForReview(context.guestName || 'Guest');
        reasoning = 'Guest mentioning review — thank them';
      } else {
        suggestion = `Hello! How can we assist you today?`;
        reasoning = 'General social message — ask how to help';
      }
    }

    // Fallback
    if (!suggestion) {
      suggestion = `Thank you for your message. We will look into this and get back to you shortly.`;
      reasoning = 'Could not determine specific response — generic acknowledgment';
    }

    return {
      suggestion,
      confidence: Math.min(top.confidence, 1.0),
      category: top.category,
      subcategory: top.subcategory,
      needsReview: true, // ALWAYS needs review
      reasoning,
      allIntents: intents.slice(0, 3)
    };
  },

  /**
   * Generate multiple suggestion options for a message
   * @param {string} guestMessage
   * @param {Object} context
   * @returns {Array<Object>} Up to 3 suggestions
   */
  suggestMultiple(guestMessage, context = {}) {
    const intents = this.detectIntents(guestMessage);
    const suggestions = [];

    // Primary suggestion
    suggestions.push(this.suggestReply(guestMessage, context));

    // If multiple intents detected, generate alternatives
    if (intents.length > 1) {
      for (let i = 1; i < Math.min(intents.length, 3); i++) {
        const altContext = { ...context };
        const alt = intents[i];
        let altSuggestion = '';
        let altReasoning = '';

        if (alt.category === 'maintenance') {
          altSuggestion = WILLOW_KB.responses.maintenance.general.acknowledge;
          altReasoning = `Alternative: general maintenance acknowledgment (${alt.subcategory})`;
        } else if (alt.category === 'social' && alt.subcategory === 'thanks') {
          altSuggestion = WILLOW_KB.responses.social.thanks.reply;
          altReasoning = 'Alternative: brief thanks acknowledgment';
        } else if (alt.category === 'booking') {
          altSuggestion = `Thank you for reaching out. Let us look into this for you and we'll get back to you shortly.`;
          altReasoning = `Alternative: booking-related acknowledgment (${alt.subcategory})`;
        }

        if (altSuggestion && altSuggestion !== suggestions[0].suggestion) {
          suggestions.push({
            suggestion: altSuggestion,
            confidence: Math.min(alt.confidence, 1.0),
            category: alt.category,
            subcategory: alt.subcategory,
            needsReview: true,
            reasoning: altReasoning
          });
        }
      }
    }

    return suggestions;
  }
};
