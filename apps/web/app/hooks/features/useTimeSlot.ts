'use client';

import { useCallback, useEffect } from 'react';
import { useQuery } from '../useQuery';
import { useRecoilState } from 'recoil';
import { timeSlotsState } from '@app/stores/time-slot';
import moment from 'moment';
import { useAuthenticateUser } from './useAuthenticateUser';
import { deleteTimerLogsRequestAPI, getTimerLogsRequestAPI } from '@app/services/client/api';

export function useTimeSlots(ids?: string[]) {
	const { user } = useAuthenticateUser();
	const [timeSlots, setTimeSlots] = useRecoilState(timeSlotsState);

	const { loading, queryCall } = useQuery(getTimerLogsRequestAPI);
	const { loading: loadingDelete, queryCall: queryDeleteCall } = useQuery(deleteTimerLogsRequestAPI);

	const getTimeSlots = useCallback(() => {
		const todayStart = moment().startOf('day').toDate();
		const todayEnd = moment().endOf('day').toDate();
		queryCall({
			tenantId: user?.tenantId ?? '',
			organizationId: user?.employee.organizationId ?? '',
			employeeId: user?.employee.id ?? '',
			todayEnd,
			todayStart
		}).then((response) => {
			if (response.data) {
				setTimeSlots(response.data.timeSlots);
			}
		});
	}, [queryCall, setTimeSlots, user]);

	const deleteTimeSlots = useCallback(() => {
		if (ids?.length) {
			queryDeleteCall({
				tenantId: user?.tenantId ?? '',
				organizationId: user?.employee.organizationId ?? '',
				ids: ids
			}).then(() => {
				const updatedSlots = timeSlots.filter((el) => (!ids?.includes(el.id) ? el : null));
				setTimeSlots(updatedSlots);
			});
		}
	}, [queryDeleteCall, setTimeSlots, ids, timeSlots, user]);

	useEffect(() => {
		getTimeSlots();
	}, [user, getTimeSlots]);

	return {
		timeSlots,
		getTimeSlots,
		deleteTimeSlots,
		loadingDelete,
		loading
	};
}