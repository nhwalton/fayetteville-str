/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";
import plansParams from "./plansParams.json"
import licenseParams from "./licenseParams.json"
import type { PlansRoot } from "../../types/plansParams";
import type { LicenseRoot } from "../../types/licenseParams";
import type { EntityResult, SearchRoot } from "~/types/searchResult";
import { addressesRepo } from "~/lib/helpers/addresses";
import { type Plan } from "~/types/plan";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        console.log('Method not allowed')
        return;
    }

    const callParams: Partial<{ [key: string]: string | string[]; }> = req.query;

    if (callParams['startDate'] && callParams['endDate'] && callParams['type']) {

        const startDate = callParams['startDate'] as string
        const endDate = callParams['endDate'] as string
        const type = callParams['type'] as string

        const plans = [] as EntityResult[]
        const results = []
        const addresses = addressesRepo.getAddresses()

        let params = {} as PlansRoot | LicenseRoot

        switch (type) {
            case "cup":
                params = plansParams as PlansRoot
                params.PlanCriteria.ApplyDateFrom = startDate
                params.PlanCriteria.ApplyDateTo = endDate
                break;
            case "str1":
                params = licenseParams as LicenseRoot
                params.LicenseCriteria.ApplicationDateFrom = startDate
                params.LicenseCriteria.ApplicationDateTo = endDate
                params.LicenseCriteria.LicenseTypeId = "42c21579-b772-450a-826b-9891d82771e6_836949f9-928d-4836-b86b-cc3235ea13a9"
                break;
            case "str2":
                params = licenseParams as LicenseRoot
                params.LicenseCriteria.ApplicationDateFrom = startDate
                params.LicenseCriteria.ApplicationDateTo = endDate
                params.LicenseCriteria.LicenseTypeId = "42c21579-b772-450a-826b-9891d82771e6_41ee66f8-1b18-487a-82e3-df113329bb5b"
                break;
            default:
                break;
        }

        const headers = new Headers();
        headers.append("Tenantid", "1")
        headers.append("Content-Type", "application/json");

        try {
            const response = await fetch("https://egov.fayetteville-ar.gov/energov_prod/selfservice/api/energov/search/search", {
                headers: headers,
                method: "POST",
                body: JSON.stringify(params)
            })
            const records = await response.json() as SearchRoot;
            plans.push(...records.Result.EntityResults)

            if (records.Result.TotalPages > 1) {
                for (let i = 2; i <= records.Result.TotalPages; i++) {
                    type === "cup" ? params.PlanCriteria.PageNumber = i : params.LicenseCriteria.PageNumber = i
                    const response = await fetch("https://egov.fayetteville-ar.gov/energov_prod/selfservice/api/energov/search/search", {
                        headers: headers,
                        method: "POST",
                        body: JSON.stringify(params)
                    })
                    const moreRecords = await response.json() as SearchRoot;
                    plans.push(...moreRecords.Result.EntityResults)
                }
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error fetching from self service API.' });
            return;
        }

        for (let i = 0; i < plans.length; i++) {
            const plan = plans[i]
            const record = {} as Plan
            if (plan && plan.AddressDisplay) {
                let address = addresses.find(a => a.address === plan.AddressDisplay)
                if (!address) {
                    try {
                        address = await addressesRepo.create(plan.AddressDisplay)
                    } catch (error) {
                        console.log(error)
                        continue;
                    }
                }
                const date = plan.ApplyDate
                const shortDate = date.split('T')[0] as string

                record.date = shortDate
                record.address = plan.AddressDisplay
                record.status = plan.CaseStatus
                record.id = plan.CaseId
                record.type = plan.CaseType
                record.lat = address.lat
                record.lng = address.lng
                record.link = `https://egov.fayetteville-ar.gov/EnerGov_Prod/SelfService#/${plan.CaseType === 'Conditional Use Permit - General' ? "plan" : "businessLicense"}/${plan.CaseId}`

                results.push(record)
            }
        }
        res.status(200).json(results);
    }
}