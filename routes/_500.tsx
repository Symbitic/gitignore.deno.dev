export default function InternalErrorPage() {
  return (
    <div class="text-center pt-40">
      <h1 class="text-6xl" data-t-key="server.errors.notfound">Unexpected Server Error</h1>
      <p class="pt-10">
        <a href="/" data-t-key="server.home">Back to Home</a>
      </p>
    </div>
  );
}
