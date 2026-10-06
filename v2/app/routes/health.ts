export function loader() {
  return Response.json(
    { status: 'ok', scope: 'phase-1-spike' },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
