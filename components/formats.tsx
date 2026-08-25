const formats = [
  {
    name: "Travel",
    description: "Light pieces made for movement without losing presence.",
  },
  {
    name: "Home",
    description: "Quiet forms that settle into daily rituals and rooms.",
  },
  {
    name: "Studio",
    description: "Tools and surfaces shaped for focused creative work.",
  },
];

export function Formats() {
  return (
    <section
      id="formats"
      aria-labelledby="formats-heading"
      className="bg-background px-6 py-24 sm:px-10 sm:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-xl">
          <h2
            id="formats-heading"
            className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Formats
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Three ways Doquier shows up — each shaped for a different pace of
            life.
          </p>
        </div>

        <ul className="mt-14 grid gap-12 border-t border-foreground/10 pt-12 sm:mt-16 sm:grid-cols-3 sm:gap-10 sm:pt-14">
          {formats.map((format) => (
            <li key={format.name} className="flex flex-col gap-3">
              <h3 className="text-xl font-medium tracking-tight text-primary">
                {format.name}
              </h3>
              <p className="text-pretty text-base leading-relaxed text-muted-foreground">
                {format.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
