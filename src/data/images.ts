/**
 * 메가MGC커피 이미지 & 브랜드 에셋 경로 매핑 파일
 * 
 * 💡 [이미지 및 로고 직접 수정 방법]
 * 1. 프로젝트의 `/public/images/` 폴더에 원하는 이미지 파일(svg, png, jpg 등)을 넣습니다.
 * 2. 아래의 해당 항목의 파일명이나 경로를 수정하시면 화면에 즉시 반영됩니다.
 *    - 전체 로고 파일: `/public/images/logo.svg`
 *    - 엠블럼 심볼 파일: `/public/images/logo-emblem.svg`
 * 3. 외부 웹 이미지 URL(https://...)을 직접 입력하셔도 정상 작동합니다.
 */

export const BRAND_ASSETS = {
  logoFull: '/images/logo.svg',
  logoEmblem: '/images/logo-emblem.svg',
};

export const MENU_IMAGES: Record<string, string> = {
  // 1. 커피 (Coffee)
  'iced-americano': '/images/menu/iced-americano.jpg',
  'hot-americano': '/images/menu/hot-americano.jpg',
  'megaricano': '/images/menu/megaricano.jpg',
  'cube-latte': '/images/menu/cube-latte.jpg',
  'vanilla-latte': '/images/menu/vanilla-latte.jpg',

  // 2. 스무디 & 프라페 (Frappe)
  'pong-crush-plain': '/images/menu/pong-crush.jpg',
  'strawberry-cookie-frappe': '/images/menu/strawberry-cookie-frappe.jpg',
  'mega-choco': '/images/menu/mega-choco.jpg',

  // 3. 티 & 에이드 (Tea & Ade)
  'honey-grapefruit-black-tea': '/images/menu/honey-grapefruit-tea.jpg',
  'blue-lemon-ade': '/images/menu/blue-lemon-ade.jpg',
  'zero-sugar-iced-tea': '/images/menu/zero-sugar-iced-tea.jpg',

  // 4. 디카페인 (Decaf)
  'decaf-americano': '/images/menu/decaf-americano.jpg',
  'decaf-cafe-latte': '/images/menu/decaf-cafe-latte.jpg',

  // 5. 디저트 & 베이커리 (Dessert)
  'plain-croffle': '/images/menu/plain-croffle.jpg',
  'potato-bread': '/images/menu/potato-bread.jpg',
  'choco-smore-cookie': '/images/menu/choco-smore-cookie.jpg',
};
