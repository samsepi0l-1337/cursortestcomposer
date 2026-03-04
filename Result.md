# User Management 모듈 종합 평가

## 1. 평가표

| 기준                                                       | 점수 (1-10) | 상세 사유 및 소규모 실수 예시                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **가독성 (Readability)**                                   | 8           | **장점:** 파일/폴더 구조가 명확하고, `auth.ts`, `lib/validations/profile.ts` 등 역할별 분리가 잘 되어 있음. **실수 예시:** `FormValues`가 `ProfileUpdateInput & { name?: string; bio?: string }`로 중복 정의되어 있어, 이미 `ProfileUpdateInput`에 포함된 필드를 다시 선언함.   |
| **작성 용이성 / 확장성 (Ease of Writing / Extensibility)** | 7.5         | **장점:** Zod 스키마를 `lib/validations/`에 두어 타입과 검증을 한 곳에서 관리. **실수 예시:** register 스키마가 `actions.ts`와 `route.ts`에 각각 정의되어 있어, 필드 추가 시 두 곳을 모두 수정해야 함.                                                                          |
| **장기 안정성 (드리프트 방지) (Long-running Stability)**   | 7           | **장점:** `session.user.id`, `session.user.role` 사용이 일관됨. **실수 예시:** `ProfileResponse` 타입이 API 응답과 수동 매핑으로 중복 정의되어, Prisma `select`와 불일치 시 타입이 맞지 않을 수 있음. `user.password` 비교 시 `user` null 체크 후에도 `user.password`가 `string | null`로 남아 타입 단언이 암묵적으로 사용됨. |
| **소규모 실수율 (Small Mistake Rate)**                     | 7           | 디버깅 리뷰에서 **7건** 발견: 중복 import, `name: null` 스키마 미처리(2곳), image 검증 에러 누락, fetch 네트워크 에러 미처리, `                                                                                                                                                 |                                             | `vs`??`로 인한 빈 문자열 처리 오류, 불필요한 `image`select. 수정 후에도`profileUpdateSchema`의 `name`은 `.nullable()`이 없어, 빈 문자열과 null 처리 정책이 bio/image와 다름. |
| **전체 만족도 (Overall Satisfaction)**                     | 7.5         | 계획대로 구현되었고, Auth.js v5, Prisma, UploadThing 통합이 잘 되어 있음. 다만 스키마 중복, null/빈값 처리 불일치, 에러 처리 누락 등 작은 실수들이 다수 있어 추가 정리가 필요함.                                                                                                |

---

## 2. .cursorrules에 추가할 5가지 규칙 제안

1. **Zod 스키마 단일 소스**: 동일 도메인의 검증 스키마는 `lib/validations/`에 한 파일로 정의하고, API 라우트·서버 액션·폼은 모두 해당 스키마를 import해 사용한다. 같은 스키마를 여러 파일에 복제하지 않는다.

2. **optional vs nullable 명시**: 폼/API에서 `null`을 받을 수 있는 필드는 `z.string().optional().nullable()`로 정의한다. `formData.get()`이 `null`을 반환하는 경우를 항상 고려한다.

3. **fetch 에러 처리**: 클라이언트의 `fetch` 호출은 `try/catch`로 감싸고, 네트워크 오류 시 사용자에게 메시지를 표시한다. `res.ok` 체크만으로는 `fetch` 자체의 throw를 처리할 수 없다.

4. **API 에러 필드 일관성**: 모든 API 에러 응답은 `{ error: string }` 형태를 유지한다. 검증 실패 시 `fieldErrors`에서 첫 번째 메시지를 추출할 때, 스키마의 모든 필드를 순서대로 포함한다.

5. **불필요한 select 제거**: Prisma `select`에는 실제로 사용하는 필드만 포함한다. 테이블/UI에 표시하지 않는 필드는 select에서 제외한다.

---

## 3. 다음 유사 규모 작업에서 개선할 3가지

1. **스키마 통합**: register처럼 API 라우트와 서버 액션에서 동일 스키마가 필요한 경우, `lib/validations/register.ts` 등을 만들어 한 곳에서 export하고 양쪽에서 import하도록 한다.

2. **null/빈값 처리 정책 수립**: `undefined`(필드 생략), `null`(명시적 제거), `""`(빈 문자열)의 의미를 문서화하고, Zod 스키마와 API/폼 전반에서 동일하게 적용한다.

3. **타입-실제 데이터 정합성**: `ProfileResponse`처럼 수동 타입을 두기보다, Prisma `select` 결과에 `satisfies`를 사용하거나, Zod `transform`으로 응답 스키마를 정의해 타입과 런타임 데이터가 어긋나지 않도록 한다.

---

## 4. 이번 작업에서 가장 잘 유지된 점

**에러 응답 형식의 일관성**  
모든 API 라우트(`/api/profile`, `/api/auth/register`)가 `NextResponse.json({ error: string }, { status })` 형태로 에러를 반환하고, 클라이언트는 `json.error`로 메시지를 표시한다. 401/403/404/500 등 상태 코드 사용도 일관되어, 에러 처리 패턴이 전반적으로 잘 유지되었다.
