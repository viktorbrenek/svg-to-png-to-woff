export type MyIconsId =
  | "com-phone-traced";

export type MyIconsKey =
  | "ComPhoneTraced";

export enum MyIcons {
  ComPhoneTraced = "com-phone-traced",
}

export const MY_ICONS_CODEPOINTS: { [key in MyIcons]: string } = {
  [MyIcons.ComPhoneTraced]: "61697",
};
