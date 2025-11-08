export function getToastClasses(type: ToastType) {
  switch (type) {
    case "success":
      return "border-green-500 bg-green-50 text-green-800";
    case "error":
      return "border-red-500 bg-red-50 text-red-800";
    case "info":
      return "border-blue-500 bg-blue-50 text-blue-800";
    case "warning":
      return "border-yellow-500 bg-yellow-50 text-yellow-800";
    default:
      return "border-gray-300 bg-white text-gray-900";
  }
}
