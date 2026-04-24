import javaBg from "@/assets/img/bg_image/java_bg.png?url";
import cssBg from "@/assets/img/bg_image/CSS_bg.png?url";
import jsBg from "@/assets/img/bg_image/JS_bg.png?url";
import databaseBg from "@/assets/img/bg_image/database_bg.png?url";
import blockchainBg from "@/assets/img/bg_image/blockchain_bg.png?url";
import algorithmBg from "@/assets/img/bg_image/algorithm_bg.png?url";

function normalizeCategoryToken(value) {
  return String(value ?? "")
    .trim()
    .replace(/,+$/g, "")
    .trim();
}

/**
 * 프론트매터 `categories`에 맞는 포스트 헤더 배경 URL을 고릅니다.
 * @param {unknown[]} categories
 * @returns {string | null}
 */
export function resolveCategoryHeroBgUrl(categories) {
  if (!Array.isArray(categories)) return null;
  const tokens = categories.map(normalizeCategoryToken).filter(Boolean);

  if (tokens.some((t) => t === "자바" || t.toLowerCase() === "java")) {
    return javaBg;
  }
  if (tokens.some((t) => t.toLowerCase() === "css")) {
    return cssBg;
  }
  if (
    tokens.some((t) => {
      const l = t.toLowerCase();
      return (
        t === "자바스크립트" ||
        l === "javascript" ||
        l === "js" ||
        l === "ecmascript"
      );
    })
  ) {
    return jsBg;
  }
  if (tokens.some((t) => t.includes("블록체인"))) {
    return blockchainBg;
  }
  if (
    tokens.some(
      (t) =>
        t.includes("데이터베이스") ||
        t.toLowerCase() === "database" ||
        t.toUpperCase() === "DB",
    )
  ) {
    return databaseBg;
  }
  if (
    tokens.some(
      (t) =>
        t.includes("알고리즘") ||
        t.toLowerCase() === "algorithm" ||
        t.toLowerCase() === "algorithms",
    )
  ) {
    return algorithmBg;
  }
  return null;
}
