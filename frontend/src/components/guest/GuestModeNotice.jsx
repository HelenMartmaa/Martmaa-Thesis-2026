function GuestModeNotice() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-medium">Guest mode</p>
      <p className="mt-1 leading-6">
        Data entered in guest mode is temporary and will not be saved after
        leaving the page or refreshing the session.
      </p>
    </div>
  );
}

export default GuestModeNotice;