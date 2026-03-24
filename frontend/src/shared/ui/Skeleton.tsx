export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <div className="aspect-[4/3] skeleton" />
    <div className="p-5 space-y-3">
      <div className="skeleton skeleton-text w-3/4" />
      <div className="skeleton skeleton-text w-full" />
      <div className="flex items-center justify-between pt-2">
        <div className="skeleton skeleton-text w-20 h-6" />
        <div className="skeleton w-24 h-9 rounded-xl" />
      </div>
    </div>
  </div>
);

export const SkeletonTableRow = () => (
  <tr>
    <td className="px-5 py-3"><div className="skeleton skeleton-text w-8" /></td>
    <td className="px-5 py-3"><div className="skeleton w-10 h-10 rounded-lg" /></td>
    <td className="px-5 py-3"><div className="space-y-1.5"><div className="skeleton skeleton-text w-32" /><div className="skeleton skeleton-text w-20 h-2.5" /></div></td>
    <td className="px-5 py-3"><div className="skeleton skeleton-text w-16 h-6 rounded-lg" /></td>
    <td className="px-5 py-3"><div className="skeleton skeleton-text w-14" /></td>
    <td className="px-5 py-3"><div className="skeleton skeleton-text w-10" /></td>
    <td className="px-5 py-3"><div className="skeleton skeleton-text w-12" /></td>
    <td className="px-5 py-3"><div className="flex justify-end gap-1"><div className="skeleton w-8 h-8 rounded-lg" /><div className="skeleton w-8 h-8 rounded-lg" /></div></td>
  </tr>
);

export const SkeletonProductDetail = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
    <div className="skeleton aspect-square rounded-3xl" />
    <div className="space-y-6">
      <div className="skeleton skeleton-text w-3/4 h-8" />
      <div className="skeleton skeleton-text w-1/3 h-10" />
      <div className="flex gap-3">
        <div className="skeleton w-36 h-12 rounded-xl" />
        <div className="skeleton w-36 h-12 rounded-xl" />
        <div className="skeleton w-36 h-12 rounded-xl" />
      </div>
      <div className="space-y-2">
        <div className="skeleton skeleton-text w-24 h-5" />
        <div className="skeleton skeleton-text w-full" />
        <div className="skeleton skeleton-text w-full" />
        <div className="skeleton skeleton-text w-2/3" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="skeleton h-16 rounded-xl" />
        <div className="skeleton h-16 rounded-xl" />
        <div className="skeleton h-16 rounded-xl" />
        <div className="skeleton h-16 rounded-xl" />
      </div>
    </div>
  </div>
);
