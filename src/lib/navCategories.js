/**
 * 사이드바·URL `?category=` 값과 동일한 키 목록.
 * NavMenu / CategoryList / PostList 필터가 이 배열을 공유합니다.
 */
export const SIDEBAR_CATEGORIES = [
  "Backend",
  "Frontend",
  "Algorithm",
  "Blockchain",
  "Security",
  "OS",
];

/**
 * URL 쿼리 값(영문) → 마크다운 frontmatter `categories:` 에 실제로 쓰인 문자열.
 * 새 글의 카테고리를 추가할 때 여기만 보완하면 됩니다.
 */
export const CATEGORY_QUERY_TO_LABELS = {
  Backend: ["JAVA", "데이터베이스", "백엔드", "Github 블로그"],
  Frontend: ["프론트엔드", "자바스크립트", "CSS", "TIL", "HTML"],
  Algorithm: ["알고리즘", "Algorithm", "algorithm"],
  Blockchain: ["블록체인"],
  Security: ["네트워크 및 웹보안", "보안"],
  OS: ["OS", "운영체제"],
};
