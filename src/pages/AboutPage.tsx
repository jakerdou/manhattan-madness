export default function AboutPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-4 p-4 pb-8">
      <h1 className="text-2xl font-bold text-primary-300">About</h1>

      {/* Premise */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-secondary-400">Premise</h2>
        <p className="text-slate-300">
          Compete in teams to claim Locations by completing Challenges for points. Handicaps may slow you down. Make strategic moves to win!
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <span><strong className="text-slate-200">Players:</strong> 4-12 (teams of 2-3)</span>
          <span><strong className="text-slate-200">Time:</strong> 3-5 hours</span>
        </div>
      </div>

      {/* Rules */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary-400">Rules</h2>

        {/* General */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-slate-200">General</h3>
          <ul className="list-disc list-inside space-y-1 text-slate-300 ml-2">
            {/* <li><strong>Start & End:</strong> Grand Central Terminal</li> */}
            <li><strong>Goal:</strong> Claim locations marked on the map (multiple teams can claim the same location)</li>
            <li><strong>Transport:</strong> No cars (buses OK)</li>
            <li><strong>Points:</strong> Earned by claiming locations or completing challenges</li>
          </ul>
        </div>

        {/* Challenges */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-slate-200">Challenges</h3>
          <ul className="list-disc list-inside space-y-1 text-slate-300 ml-2">
            {/* <li>Generate a random number 1-50 (Siri/Google) when you arrive at a location</li> */}
            <li>Must fully arrive (inside, upstairs, etc.) before pulling a challenge</li>
            <li><strong>Veto:</strong> Can't complete? Pay the veto penalty in points</li>
            <li><strong>Claiming:</strong> Complete a challenge to claim → earn location points only (not challenge points)</li>
            <li><strong>Vetoing while claiming:</strong> Subtract veto penalty from location points, then pull another challenge</li>
            <li><strong>Between locations:</strong> May pull up to 2 challenges (one at a time). Veto penalty still applies if incomplete</li>
          </ul>
        </div>

        {/* Handicaps */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-slate-200">Handicaps</h3>
          <ul className="list-disc list-inside space-y-1 text-slate-300 ml-2">
            <li>Mixed in with challenges — random chance to pull one</li>
            <li>Must act immediately, then pull another challenge to claim</li>
            <li><strong>Non-vetoable</strong></li>
          </ul>
        </div>

        {/* Game/Admin */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-slate-200">Admin</h3>
          <ul className="list-disc list-inside space-y-1 text-slate-300 ml-2">
            {/* <li><strong>Document:</strong> Photos for proof, track claimed locations & points</li> */}
            <li><strong>Late penalty:</strong> -25 points per minute late returning to Grand Central</li>
            <li><strong>Safety:</strong> Avoid suspicious behavior, especially indoors</li>
          </ul>
        </div>
      </div>

      {/* Links */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-secondary-400">Links</h2>
        <ul className="list-disc list-inside space-y-1 text-slate-300 ml-2">
          <li>
            <a 
              href="https://sites.google.com/view/metromaze/nyc-games/manhattan-madness" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-secondary-400 hover:text-secondary-300"
            >
              Original Game
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
