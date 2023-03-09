import React, { PropsWithChildren } from "react";
import styles from "./DasboardTableExtraInfo.module.css";

export const DashboardTableExtraInfo: React.FC<PropsWithChildren> = ({ children }) => {
    return <tr><td className={styles.cartsTableAdditional} colSpan={100}>{children}</td></tr>;
};
