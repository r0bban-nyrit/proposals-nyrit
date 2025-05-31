
interface QuoteRotInfoProps {
  hasRotItems: boolean;
}

export function QuoteRotInfo({ hasRotItems }: QuoteRotInfoProps) {
  if (!hasRotItems) return null;

  return (
    <div className="mt-8 text-sm bg-green-50 dark:bg-green-900/20 p-4 rounded border border-green-200 dark:border-green-800">
      <h3 className="font-semibold mb-2 text-green-800 dark:text-green-300">Information om ROT-avdrag:</h3>
      <p className="text-green-800 dark:text-green-300 break-words">
        ROT-avdraget är ett skatteavdrag som ger privatpersoner möjlighet att få skattereduktion för arbetskostnader vid reparation, underhåll samt om- och tillbyggnad av bostäder. 
        Avdraget uppgår till 30% av arbetskostnaden, upp till maximalt 50 000 kr per person och år.
      </p>
    </div>
  );
}
