import React from "react";
import {BottomSheetBackdrop, BottomSheetBackdropProps} from "@gorhom/bottom-sheet";

const MenuBackdrop = (props: BottomSheetBackdropProps) => {
    return (
        <BottomSheetBackdrop
            {...props}
            opacity={0.4}
            disappearsOnIndex={-1}
            appearsOnIndex={0} />
    )
};

export default MenuBackdrop;
