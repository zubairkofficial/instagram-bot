"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdsController = void 0;
class AdsController {
    constructor() {
        this.graphApiBaseUrl = 'https://graph.facebook.com/v13.0';
        this.API_ACCESS_TOKEN = "TOKEN";
    }
    runAd(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { campaignId, adCreativeId, adSetName, budget, adAccountId } = req.body;
            try {
                const response = yield fetch(`${this.graphApiBaseUrl}/act_${adAccountId}/ads`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        access_token: this.API_ACCESS_TOKEN,
                        campaign_id: campaignId,
                        name: adSetName,
                        status: 'PAUSED',
                        creative: { creative_id: adCreativeId },
                        daily_budget: budget
                    })
                });
                if (!response.ok)
                    throw new Error('Network response was not ok.');
                const adResponse = yield response.json();
                res.json({ success: true, response: adResponse });
            }
            catch (error) {
                res.status(500).json({ success: false, message: "Failed to run ad", error });
            }
        });
    }
    // Function to schedule ads
    scheduleAd(req, res) {
        const { timeToRun, campaignId, adCreativeId, adSetName, budget, adAccountId } = req.body;
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            console.log("Running scheduled ad.");
            try {
                const payload = {
                    access_token: this.API_ACCESS_TOKEN,
                    campaign_id: campaignId,
                    name: adSetName,
                    status: 'PAUSED',
                    creative: { creative_id: adCreativeId },
                    daily_budget: budget
                };
                const response = yield fetch(`${this.graphApiBaseUrl}/act_${adAccountId}/ads`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) {
                    throw new Error('Failed to run scheduled ad');
                }
                const jsonResponse = yield response.json();
                console.log("Scheduled ad run successfully:", jsonResponse);
            }
            catch (error) {
                console.error("Error running scheduled ad:", error);
            }
        }), timeToRun);
        res.json({ success: true, message: `Ad scheduled to run in ${timeToRun} milliseconds` });
    }
    getAnalytics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { adId } = req.params; // Adjust this line if adId is actually in the query or body
            try {
                const response = yield fetch(`${this.graphApiBaseUrl}/${adId}/insights?access_token=${this.API_ACCESS_TOKEN}&metric=impressions,reach,clicks,cost_per_impression`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok)
                    throw new Error('Network response was not ok.');
                const analyticsResponse = yield response.json();
                res.json({ success: true, response: analyticsResponse });
            }
            catch (error) {
                res.status(500).json({ success: false, message: "Failed to fetch analytics", error });
            }
        });
    }
}
exports.AdsController = AdsController;
//# sourceMappingURL=ads-controller.js.map