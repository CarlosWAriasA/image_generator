import Replicate from "replicate";
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function POST(request) {
  const data = await request.json();
  try {
    const input = {
      prompt: data?.inputPrompt + " " + data.defaultPrompt,
      main_face_image: data?.userImageUrl,
      image: data?.userImageUrl,
    };
    const output = await replicate.run(data?.aiModelName, { input });

    const reader = (output[0] ?? output).getReader();
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const blob = new Blob(chunks, { type: "image/png" });
    const arrayBuffer = await blob.arrayBuffer();
    const base64String = arrayBufferToBase64(arrayBuffer);

    return new Response(
      JSON.stringify({ image: `data:image/png;base64,${base64String}` }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.log("error", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
