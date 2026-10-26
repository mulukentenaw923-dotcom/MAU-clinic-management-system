const navigation = [
  'Dashboard',
  'Patient search',
  'Doctor workspace',
  'Sick leave',
  'Pharmacy',
];

export default function Sidebar() {
  return (
    <aside className="w-full border-b border-slate-200 bg-white p-4 md:min-h-screen md:w-60 md:border-b-0 md:border-r">
      <nav aria-label="Main navigation">
        <ul className="flex gap-2 overflow-x-auto md:flex-col">
          {navigation.map((item, index) => (
            <li key={item}>
              <a
                aria-current={index === 0 ? 'page' : undefined}
                className={`block whitespace-nowrap rounded-lg px-3 py-2 text-sm ${index === 0 ? 'bg-teal-50 font-semibold text-teal-800' : 'text-slate-600 hover:bg-slate-50'}`}
                href="#"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
