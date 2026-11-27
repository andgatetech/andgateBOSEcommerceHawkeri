import { normalizeBdPhone } from "@/lib/bdPhone";
import type { AddressFormValue } from "@/components/shared/AddressDetailsForm";
import type { EcommerceAddressPayload, EcommerceOrderShippingAddress } from "@/types";

export const emptyAddressFormValue: AddressFormValue = {
  fullName: "",
  phone: "",
  districtId: "",
  districtName: "",
  zoneId: "",
  zoneName: "",
  areaId: "",
  areaName: "",
  addressLine: "",
  note: "",
  label: "home",
};

export function shippingAddressToFormValue(
  shippingAddress: EcommerceOrderShippingAddress | null,
): AddressFormValue {
  if (!shippingAddress) {
    return emptyAddressFormValue;
  }

  return {
    fullName: shippingAddress.name ?? "",
    phone: shippingAddress.phone ?? "",
    districtId: shippingAddress.city_id ? String(shippingAddress.city_id) : "",
    districtName: shippingAddress.city ?? "",
    zoneId: shippingAddress.zone_id ? String(shippingAddress.zone_id) : "",
    zoneName: shippingAddress.zone ?? "",
    areaId: shippingAddress.area_id ? String(shippingAddress.area_id) : "",
    areaName: shippingAddress.area ?? "",
    addressLine: shippingAddress.address_line ?? "",
    note: "",
    label: shippingAddress.type ?? "home",
  };
}

export function formValueToAddressPayload(
  formValue: AddressFormValue,
): EcommerceAddressPayload {
  return {
    city_id: Number(formValue.districtId) || null,
    zone_id: Number(formValue.zoneId) || null,
    area_id: Number(formValue.areaId) || null,
    type: formValue.label,
    label: null,
    name: formValue.fullName.trim(),
    phone: normalizeBdPhone(formValue.phone),
    address_line: formValue.addressLine.trim(),
    city: formValue.districtName.trim(),
    zone: formValue.zoneName.trim(),
    area: formValue.areaName.trim(),
    postal_code: "",
  };
}

export const formValueToShippingAddress = formValueToAddressPayload;

export function getAddressDisplayLines(
  shippingAddress: EcommerceOrderShippingAddress,
) {
  const locationLine = [shippingAddress.area, shippingAddress.zone, shippingAddress.city]
    .filter(Boolean)
    .join(", ");

  return {
    name: shippingAddress.name,
    phone: shippingAddress.phone,
    addressLine: shippingAddress.address_line,
    locationLine,
  };
}
