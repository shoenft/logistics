import myhttp from "./httpService";
import {
  apiUrl
} from "../CRUDAppConfigs.json";

const apiEndPoint = apiUrl + "/transportcapacitybookings"

export function getTransportcapacitybookings() {
  return myhttp.get(apiEndPoint);
}

export function deleteTransportcapacitybooking(id) {
  return myhttp.delete(apiEndPoint + "/" + id);
}

export function getTransportcapacitybooking(data) {
  return myhttp.get(`${apiEndPoint}/${data.bookingid}?fromdate=${data.fromdate}&todate=${data.todate}`);
}

export function saveTransportcapacitybooking(transportcapacitybooking) {
  if (transportcapacitybooking._id) {
    const body = {
      ...transportcapacitybooking
    };
    delete body._id;
    return myhttp.put(apiEndPoint + "/" + transportcapacitybooking._id, body);
  }
  return myhttp.post(apiEndPoint, transportcapacitybooking);
}