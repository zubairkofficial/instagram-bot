import { Request, Response } from 'express';

// Interface for the body of the runAd request
interface IRunAdRequest {
    campaignId: string;
    adCreativeId: string;
    adSetName: string;
    budget: number;
    adAccountId: string;
}

// Interface for the body of the scheduleAd request
// Assuming it has the same structure as IRunAdRequest plus the timeToRun
interface IScheduleAdRequest extends IRunAdRequest {
    timeToRun: number;
}

// Interface for the parameters of the getAnalytics request
interface IGetAnalyticsRequest {
    adId: string; // Assuming adId is coming from req.params
}

export class AdsController {
    private graphApiBaseUrl: string = 'https://graph.facebook.com/v13.0';
    private readonly API_ACCESS_TOKEN: string = "TOKEN";

    public async runAd(req: Request, res: Response) {
        const { campaignId, adCreativeId, adSetName, budget, adAccountId } = req.body as IRunAdRequest;
        try {
            const response = await fetch(`${this.graphApiBaseUrl}/act_${adAccountId}/ads`, {
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

            if (!response.ok) throw new Error('Network response was not ok.');

            const adResponse = await response.json();
            res.json({ success: true, response: adResponse });
        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to run ad", error });
        }
    }

    // Function to schedule ads
    public scheduleAd(req: Request, res: Response) {
        const { timeToRun, campaignId, adCreativeId, adSetName, budget, adAccountId } = req.body as IScheduleAdRequest;
        setTimeout(async () => {
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

                const response = await fetch(`${this.graphApiBaseUrl}/act_${adAccountId}/ads`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error('Failed to run scheduled ad');
                }

                const jsonResponse = await response.json();
                console.log("Scheduled ad run successfully:", jsonResponse);
            } catch (error) {
                console.error("Error running scheduled ad:", error);
            }
        }, timeToRun);

        res.json({ success: true, message: `Ad scheduled to run in ${timeToRun} milliseconds` });
    }

    public async getAnalytics(req: Request, res: Response) {
        const { adId } = req.params as any as IGetAnalyticsRequest; // Adjust this line if adId is actually in the query or body
        try {
            const response = await fetch(`${this.graphApiBaseUrl}/${adId}/insights?access_token=${this.API_ACCESS_TOKEN}&metric=impressions,reach,clicks,cost_per_impression`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Network response was not ok.');

            const analyticsResponse = await response.json();
            res.json({ success: true, response: analyticsResponse });
        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to fetch analytics", error });
        }
    }
}