import type { ReactNode } from "react";
import styles from "./PageWrapper.module.scss";
import { cx } from "../../utils/classNames";

export default function PageWrapper({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cx(styles.pageWrapper, className)}>{children}</div>;
}
