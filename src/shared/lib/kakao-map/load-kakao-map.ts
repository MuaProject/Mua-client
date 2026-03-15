let kakaoMapLoaderPromise: Promise<any> | null = null;

export function loadKakaoMap() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window is not available.'));
  }

  if (window.kakao?.maps) {
    return new Promise((resolve) => {
      window.kakao.maps.load(() => resolve(window.kakao));
    });
  }

  if (kakaoMapLoaderPromise) {
    return kakaoMapLoaderPromise;
  }

  const appKey = import.meta.env.VITE_KAKAO_MAP_JS_KEY;

  if (!appKey) {
    return Promise.reject(
      new Error('VITE_KAKAO_MAP_JS_KEY is not configured.'),
    );
  }

  kakaoMapLoaderPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-map-sdk="true"]',
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        window.kakao.maps.load(() => resolve(window.kakao));
      });
      existingScript.addEventListener('error', () => {
        reject(new Error('Failed to load Kakao Map SDK.'));
      });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&libraries=services&appkey=${appKey}`;
    script.async = true;
    script.dataset.kakaoMapSdk = 'true';
    script.onload = () => {
      window.kakao.maps.load(() => resolve(window.kakao));
    };
    script.onerror = () => {
      reject(new Error('Failed to load Kakao Map SDK.'));
    };

    document.head.appendChild(script);
  });

  return kakaoMapLoaderPromise;
}
