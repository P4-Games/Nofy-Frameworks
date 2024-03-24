//These types are defined to make the frames buttons work:

import { Button } from "frames.js/next";

export type AllowedButton = React.ReactComponentElement<typeof Button>;

export type AllowedButtonsArray = [] | [AllowedButton] | [AllowedButton, AllowedButton] | [AllowedButton, AllowedButton, AllowedButton] | [
    AllowedButton,
    AllowedButton,
    AllowedButton,
    AllowedButton
]; //0-3 buttons
