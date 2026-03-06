/**
 * 通行证校验：使用 SHA-256 哈希比对，源码中不包含明文通行证。
 * 预期值以分段形式存储，降低直接搜索命中率。
 */

const encoder = new TextEncoder();

async function sha256Hex(data: string): Promise<string> {
  const buf = encoder.encode(data);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** 预期哈希以 base64 存贮，运行时解码后参与比对，源码中不出现明文哈希 */
function getExpectedDigest(): string {
  const b64 =
    'OWE5MWU0YzE5NDc4NmNhMmIxODMxMDk0MDlmNmViNTA3YTk0MmRkOTYzOTViYjg5MjM1N2ViYmM0MWQwYjUyYQ==';
  return atob(b64);
}

/**
 * 校验通行证是否与允许注册的通行证一致。
 * 仅用于前端限制注册，不替代后端鉴权。
 */
export async function verifyPassphrase(input: string): Promise<boolean> {
  if (!input || typeof input !== 'string') return false;
  const digest = await sha256Hex(input.trim());
  return digest === getExpectedDigest();
}
