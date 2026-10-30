/**
 * Browser-native DEFLATE streams. `deflate-raw` carries no gzip/zlib header or
 * checksum, so it is the smallest payload to put inside a share link.
 */
export const deflateText = async (text: string): Promise<Uint8Array> => {
	const stream = new Blob([new TextEncoder().encode(text)])
		.stream()
		.pipeThrough(new CompressionStream("deflate-raw"));
	return new Uint8Array(await new Response(stream).arrayBuffer());
};

export const inflateText = async (bytes: Uint8Array): Promise<string> => {
	const stream = new Blob([new Uint8Array(bytes)])
		.stream()
		.pipeThrough(new DecompressionStream("deflate-raw"));
	return new Response(stream).text();
};
