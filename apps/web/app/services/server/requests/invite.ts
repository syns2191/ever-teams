import { ILoginReponse } from '@app/interfaces/IAuthentication';
import { PaginationResponse } from '@app/interfaces/IDataResponse';
import {
	IInvitation,
	IInviteCreate,
	IInviteVerified,
	IInviteVerifyCode,
} from '@app/interfaces/IInvite';
import { serverFetch } from '../fetch';

/**
 * Invite user using email request
 *
 * @param body
 * @param bearer_token
 * @returns
 */
export function inviteByEmailsRequest(
	{ tenantId, ...body }: IInviteCreate & { tenantId: string },
	bearer_token: string
) {
	return serverFetch<PaginationResponse<IInvitation>>({
		path: '/invite/emails',
		method: 'POST',
		body,
		bearer_token,
		tenantId,
	});
}

type ITeamInvitationsRequest = {
	tenantId: string;
	organizationId: string;
	role: 'EMPLOYEE';
	teamId: string;
};

/**
 * Get all team invitations request
 *
 * @param param0
 * @param bearer_token
 * @returns
 */
export function getTeamInvitationsRequest(
	{ teamId, tenantId, organizationId, role }: ITeamInvitationsRequest,
	bearer_token: string
) {
	const query = new URLSearchParams({
		'where[tenantId]': tenantId,
		'where[organizationId]': organizationId,
		'where[role][name]': role,
		'where[teams][id][0]': teamId,
	});
	return serverFetch<PaginationResponse<IInvitation>>({
		path: `/invite?${query.toString()}`,
		method: 'GET',
		bearer_token,
		tenantId: tenantId,
	});
}

type ResetInviteParams = {
	inviteId: string;
	inviteType: 'TEAM';
	organizationId: string;
	callbackUrl?: string;
	tenantId: string;
};

/**
 *  Resend email invite request
 *
 * @param params
 * @param bearer_token
 * @returns
 */
export function resendInvitationEmailRequest(
	params: ResetInviteParams,
	bearer_token: string
) {
	return serverFetch<PaginationResponse<IInvitation>>({
		path: '/invite/resend',
		method: 'POST',
		body: params,
		bearer_token,
		tenantId: params.tenantId,
	});
}

/**
 * Verify invite code request
 *
 * @param params
 * @returns
 */
export function verifyInviteCodeRequest(params: IInviteVerifyCode) {
	return serverFetch<IInviteVerified>({
		path: '/invite/validate-by-code',
		method: 'POST',
		body: params,
	});
}

export interface AcceptInviteParams {
	user: {
		firstName: string;
		lastName: string;
		email: string;
	};
	password: string;
	code: string;
	email: string;
}

/**
 * Accept Invite request
 *
 * @param params
 * @returns
 */
export function acceptInviteRequest(params: AcceptInviteParams) {
	return serverFetch<ILoginReponse>({
		path: '/invite/accept',
		method: 'POST',
		body: params,
	});
}