import { ICreateDailyPlan } from '@app/interfaces';
import { authenticatedGuard } from '@app/services/server/guards/authenticated-guard-app';
import { createPlanRequest, getAllDayPlans } from '@app/services/server/requests';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const res = new NextResponse();
	const { $res, user, access_token: bearer_token, tenantId } = await authenticatedGuard(req, res);

	if (!user) return $res('Unauthorized');

	const body = (await req.json()) as unknown as ICreateDailyPlan;

	const response = await createPlanRequest({ data: body, bearer_token, tenantId });

	return $res(response.data);
}

export async function GET(req: Request) {
	const res = new NextResponse();

	const { $res, user, tenantId, organizationId, access_token } = await authenticatedGuard(req, res);
	if (!user) return $res('Unauthorized');

	const response = await getAllDayPlans({
		bearer_token: access_token,
		organizationId,
		tenantId
	});

	return $res(response.data);
}
