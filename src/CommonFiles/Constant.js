// export const BASE_URL = 'https://rajputana.webmastersinfotech.in/api/';
// export const BASE_URL = 'https://rajputanaagency.webmastersinfotech.in/newapi/';
export const BASE_URL = 'https://rajputana.webmastersinfotech.in/admin/api-1.0/';


export const IMAGE_BASE_URL = 'https://rajputana.webmastersinfotech.in/';

export const ENDPOINTS = {
  LOGIN: `${BASE_URL}login.php`,
  List_Staff: `${BASE_URL}list_staff.php`,
  Add_Staff: `${BASE_URL}add_staff.php`,
  Staff_Schedule_List: `${BASE_URL}list_schedule.php`,
  Add_Schedule: `${BASE_URL}add_schedule.php`,
  Search_History: `${BASE_URL}search_history.php`,
  Delete_Staff: `${BASE_URL}delete_staff.php`,
  Update_Staff: `${BASE_URL}update_staff.php`,
  Delete_Schedule: `${BASE_URL}delete_schedule.php`,
  Update_Schedule: `${BASE_URL}update_schedule.php`,
  Intimation_Vehicle: `${BASE_URL}intimation_vehicle.php`,
  Add_Intimation: `${BASE_URL}add_intimation.php`,
  Search_Schedule: `${BASE_URL}search_schedule.php`,
  Status_Schedule: `${BASE_URL}status_schedule.php`,
  add_notification_msg: `${BASE_URL}add_notification_msg.php`,
  update_notification_msg: `${BASE_URL}update_notification_msg.php`,
  delete_notification_msg: `${BASE_URL}delete_notification_msg.php`,
  list_notification_msg: `${BASE_URL}list_notification_msg.php`,
  reset_Device_Id: `${BASE_URL}reset_device.php`,
  finance_update: `${BASE_URL}finance_update.php`,
  Staff_Agency_Logout: `${BASE_URL}staff_agency_logout.php`,
  Staff_Account_Status: `${BASE_URL}staff_account_status.php`,
  search_history_paginate: `${BASE_URL}search_history_paginate.php`,
  search_history_search: `${BASE_URL}search_history_search.php`,

  Finance_List: (rentAgencyId, staff_id) =>
    `${BASE_URL}finance_list.php?rent_agency_id=${rentAgencyId}&staff_id=${staff_id}`,

  ICard: (userId, type) =>
    `${BASE_URL}icard.php?user_id=${userId}&type=${type}`,


  ICardApi: (userId, type) =>
    `${BASE_URL}icard_api.php?user_id=${userId}&type=${type}`,

};
