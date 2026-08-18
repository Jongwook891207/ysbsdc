/**
 * Expanded from a 3-sentence identity blurb into a 3-tier "what conservative
 * training actually left him with" narrative: plain intro → a visually
 * distinct 3-question focal block → plain explanation that closes on a
 * judgment habit, not "무조건 살립니다". Deliberately keeps the
 * implant/denture/second-opinion mention to a single comparative sentence
 * (not a treatment-selection explainer — that's /treatment's job) per the
 * explicit scope limit on this section.
 */
export function ConservativeBackgroundSection() {
  return (
    <section className="background-section" id="background">
      <div className="container">
        <div className="section-head" data-aos="fade-up">
          <span className="eyebrow">치과보존과 수련이 제 진료에 남긴 것</span>
        </div>

        <div className="background-text" data-aos="fade-up" data-aos-delay={80}>
          <p>
            치과보존과는 충치나 외상으로 손상된 치아를 치료하고, 신경치료 등을 통해 자연치아를 가능한 오래
            사용할 수 있도록 치료하는 분야입니다.
          </p>
          <p>저 역시 수련 과정에서 수많은 치아를 보며 어떻게 하면 이 치아를 살릴 수 있을지를 배웠습니다.</p>
          <p>하지만 시간이 지나면서 제 진료에 더 크게 남은 것은 치료 기술만은 아니었습니다.</p>
        </div>

        <div className="background-questions" data-aos="fade-up" data-aos-delay={150}>
          <div className="rule"></div>
          <p>이 치아는 정말 치료해서 살리는 것이 나은가.</p>
          <p>치료한다면 앞으로 얼마나 사용할 수 있을까.</p>
          <p>
            지금 치료해야 하는가,
            <br />
            조금 더 지켜봐도 되는가.
          </p>
        </div>

        <div className="background-text" data-aos="fade-up" data-aos-delay={80}>
          <p>치료를 시작하기 전에 이런 질문부터 던지는 습관이 생겼습니다.</p>
          <p>
            치과에서는 할 수 있는 치료가 여러 가지인 경우가 많습니다. 그래서 저는 <strong>“할 수 있는
            치료가 무엇인가”보다 “이 환자분에게 지금 어떤 치료가 더 적절한가”</strong>를 먼저 생각하려고
            합니다.
          </p>
          <p>
            한 가지 방법만 보지 않고, 보존 가능성과 예후, 환자분의 상황과 다른 선택지를 함께 비교해서
            판단합니다.
          </p>
          <p>
            제가 치과보존과에서 배운 것은 <strong>“무조건 치아를 살려야 한다”</strong>는 생각이 아닙니다.
          </p>
          <p className="background-conclusion">
            살릴 수 있는지, 살리는 것이 의미가 있는지, 다른 치료가 더 나은 선택은 아닌지를 충분히 살펴본
            뒤 결정하는 것. 그 판단하는 습관이 지금도 제 임플란트, 틀니, 신경치료의 출발점입니다.
          </p>
        </div>
      </div>
    </section>
  );
}
