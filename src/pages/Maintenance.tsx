function MaintenancePage() {
  return (
    <main className="min-h-screen bg-background font-[Inter] text-foreground">
      <div className="container mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-8 flex flex-col items-center">
          <img
            src="/lp_logo.png"
            alt="Lucy's Perfumery logo"
            className="mb-4 h-20 w-20 rounded-md border-2 border-primary/20 object-contain"
          />
          <p className="text-2xl font-semibold">Lucy&apos;s Perfumery</p>
          <h1 className="mt-6 text-3xl font-semibold text-primary sm:text-4xl">
            Site Under Maintenance
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            We&apos;re making a few updates to the store right now. We&apos;ll
            be back soon with our original perfumes, diffusers, body splashes,
            and more.
          </p>
          <p className="mt-6 text-base leading-7">
            <span className="font-medium">Status:</span> Scheduled maintenance
            in progress.
          </p>
          <p className="mt-3 text-base leading-7">
            Need help now?{" "}
            <a
              href="https://wa.me/233555271090"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline underline-offset-4"
            >
              Chat with us on WhatsApp
            </a>
          </p>
          <p className="mt-8 text-sm text-muted-foreground">
            Thank you for your patience.
          </p>
        </div>
      </div>
    </main>
  );
}

export default MaintenancePage;
