// Cloudflare Workers 프록시 코드
// https://workers.cloudflare.com/ 에서 무료로 배포 가능

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // CORS 헤더 설정
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version',
  }

  // Preflight 요청 처리
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // 원본 요청에서 헤더와 바디 추출
    const headers = new Headers(request.headers)
    const body = await request.text()

    // Anthropic API로 프록시
    const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': headers.get('x-api-key'),
        'anthropic-version': headers.get('anthropic-version') || '2023-06-01'
      },
      body: body
    })

    // 응답 반환
    const responseBody = await apiResponse.text()
    return new Response(responseBody, {
      status: apiResponse.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
}
