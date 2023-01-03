import styled from "@emotion/styled";
import { FC, useEffect, useRef } from "react";

type LoaderTriggerProps = {
  className?: string;
  loading: boolean;
  top: number;
  onTrigger: () => void;
};

const LoaderTrigger: FC<LoaderTriggerProps> = ({
  loading,
  top,
  onTrigger,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const observer = new IntersectionObserver(([entry]) => {
      if (!loading && entry.isIntersecting) {
        onTrigger();
      }
    }, {});

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [loading, onTrigger]);

  return <div ref={ref} className={className} onClick={onTrigger} style={{ top }} />
};

export const StyledLoaderTrigger = styled(LoaderTrigger)`
  position: absolute;
  min-width: 100vw;
  min-height: 20vh;
`;

