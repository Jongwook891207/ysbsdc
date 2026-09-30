"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  /** 치료 전 사진 — 핸들 왼쪽에 보인다. */
  beforeSrc: string;
  /** 치료 후 사진 — 기준 프레임(핸들 오른쪽). */
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  /** afterSrc 원본 픽셀 크기 — 레이아웃 시프트 방지용 aspect-ratio 계산에 쓴다. */
  width: number;
  height: number;
}

/**
 * 치료 전후 비교 슬라이더 (/cases 전용). 가운데 핸들을 드래그하면
 * 왼쪽(치료 전) 영역의 clip 폭이 바뀐다. 전제: 두 사진은 같은 구도로
 * 정합(스크립트로 사전 정렬)되어 있어야 한다 — 컴포넌트는 정렬을
 * 보정하지 않는다. 마우스·터치(pointer events)와 키보드(방향키)를
 * 모두 지원한다.
 */
export function BeforeAfterSlider({ beforeSrc, afterSrc, beforeAlt, afterAlt, width, height }: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  const rootRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, next)));
  }, []);

  return (
    <div
      ref={rootRef}
      className="ba-slider"
      style={{ aspectRatio: `${width} / ${height}` }}
      onPointerDown={(e) => {
        draggingRef.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (draggingRef.current) setFromClientX(e.clientX);
      }}
      onPointerUp={() => {
        draggingRef.current = false;
      }}
      onPointerCancel={() => {
        draggingRef.current = false;
      }}
    >
      <Image src={afterSrc} alt={afterAlt} width={width} height={height} className="ba-img" sizes="(max-width: 900px) 100vw, 820px" />
      <div className="ba-top" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} aria-hidden="true">
        <Image src={beforeSrc} alt={beforeAlt} fill sizes="(max-width: 900px) 100vw, 820px" className="ba-img-fill" />
      </div>
      <div className="ba-divider" style={{ left: `${pos}%` }} aria-hidden="true" />
      <button
        type="button"
        className="ba-handle"
        style={{ left: `${pos}%` }}
        role="slider"
        aria-label="치료 전후 비교 핸들"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`치료 전 영역 ${Math.round(pos)}%`}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            setPos((p) => Math.max(0, p - 4));
            e.preventDefault();
          } else if (e.key === "ArrowRight") {
            setPos((p) => Math.min(100, p + 4));
            e.preventDefault();
          }
        }}
      >
        <span aria-hidden="true">◂▸</span>
      </button>
      <span className="ba-tag ba-tag-before">치료 전</span>
      <span className="ba-tag ba-tag-after">치료 후</span>
    </div>
  );
}
