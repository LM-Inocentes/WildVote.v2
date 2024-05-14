const BASE_URL = 'https://wildvote.onrender.com';


export const LOGIN_URL = BASE_URL + '/api/users/login';
export const FINGERPRINT_LOGIN_URL = BASE_URL + '/api/users/login/fingerprint';
export const LOGOUT_URL = BASE_URL + '/api/users/logout';
export const REGISTER_URL = BASE_URL + '/api/users/register';
export const GET_USERS_URL = BASE_URL + '/api/users/get';
export const GET_USER_BY_ID_URL = BASE_URL + '/api/users/get/';
export const EDIT_USER_BY_ID_URL = BASE_URL + '/api/users/edit/';
export const VOTED_USER_URL = BASE_URL + '/api/users/edit/voted';
export const USER_VOTE_RESULT_URL = BASE_URL + '/api/users/vote';
export const USER_COUNT_URL = BASE_URL + '/api/users/user-count';
export const USER_COUNT_VOTED_URL = BASE_URL + '/api/users/user-count/voted';
export const USER_FINGERPRINT_REGISTERED_COUNT_URL = BASE_URL + '/api/users/user-count/fingerprint/registered';
export const USER_FINGERPRINT_REGISTERED_URL = BASE_URL + '/api/users/fingerprint';
export const GET_USER_VOTE_RESULT_URL = BASE_URL + '/api/users/vote/';
export const USER_VOTE_RESET_RESULT_URL = BASE_URL + '/api/users/vote/reset';
export const RESET_VOTED_USER_URL = BASE_URL + '/api/users/reset/voted';
export const ADMIN_USER_URL = BASE_URL + '/api/users/edit/isAdmin';
export const ISNOTADMIN_USER_URL = BASE_URL + '/api/users/edit/isnotAdmin';
export const SEARCH_USER_BY_ID_URL = BASE_URL + '/api/users/';
export const DELETE_USER_BY_ID = BASE_URL + '/api/users/delete/';

export const ADD_CANDIDATE_URL = BASE_URL + '/api/candidates/add';
export const GET_CANDIDATES_URL = BASE_URL + '/api/candidates/get';
export const EDIT_CANDIDATE_URL = BASE_URL + '/api/candidates/edit';
export const GET_CANDIDATES_BY_ID_URL = BASE_URL + '/api/candidates/get/';
export const PRESIDENT_CANDIDATES_URL = BASE_URL + '/api/candidates/get/president';
export const VICE_PRESIDENT_CANDIDATES_URL = BASE_URL + '/api/candidates/get/vice-president';
export const SECRETARY_CANDIDATES_URL = BASE_URL + '/api/candidates/get/secretary';
export const TREASURER_CANDIDATES_URL = BASE_URL + '/api/candidates/get/treasurer';
export const AUDITOR_CANDIDATES_URL = BASE_URL + '/api/candidates/get/auditor';
export const ARCH_CANDIDATES_URL = BASE_URL + '/api/candidates/get/arch-representative';
export const CHE_CANDIDATES_URL = BASE_URL + '/api/candidates/get/che-representative"';
export const CE_CANDIDATES_URL = BASE_URL + '/api/candidates/get/ce-representative';
export const CPE_CANDIDATES_URL = BASE_URL + '/api/candidates/get/cpe-representative';
export const EE_CANDIDATES_URL = BASE_URL + '/api/candidates/get/ee-representative';
export const ECE_CANDIDATES_URL = BASE_URL + '/api/candidates/get/ece-representative';
export const IE_CANDIDATES_URL = BASE_URL + '/api/candidates/get/ie-representative';
export const ME_CANDIDATES_URL = BASE_URL + '/api/candidates/get/me-representative';
export const EM_CANDIDATES_URL = BASE_URL + '/api/candidates/get/em-representative';
export const CS_CANDIDATES_URL = BASE_URL + '/api/candidates/get/cs-representative';
export const IT_CANDIDATES_URL = BASE_URL + '/api/candidates/get/it-representative';
export const CNAHS_CANDIDATES_URL = BASE_URL + '/api/candidates/get/cnahs-representative';
export const CMBA_CANDIDATES_URL = BASE_URL + '/api/candidates/get/cmba-representative';
export const CASE_CANDIDATES_URL = BASE_URL + '/api/candidates/get/case-representative';
export const CCJ_CANDIDATES_URL = BASE_URL + '/api/candidates/get/ccj-representative';

export const REMOVE_CANDIDATE_URL = BASE_URL + '/api/candidates/remove/';

export const SET_ELECTION_URL = BASE_URL + '/api/misc/set-election';
export const GET_ELECTION_STATUS_URL = BASE_URL + '/api/misc/get-election-status';