export default function Manual() {
  return (
    <section className="manual" id="manual">
      <div className="wrap">
        <div className="manual-head">
          <div>
            <p className="kicker mono">02 · How I lead</p>
            <h2 className="section-title pop">My operating<br />manual.</h2>
          </div>
          <p className="pop">What ten years of building design teams taught me, and how AI changed the way I work.</p>
        </div>
        <div className="tabs" role="tablist" aria-label="Leadership habits" data-tabs>
          <button className="tab" role="tab" id="t1" aria-controls="p1" aria-selected="true" style={{'--c': 'var(--sun)'}}><span className="n">01</span> Outcome first</button>
          <button className="tab" role="tab" id="t2" aria-controls="p2" aria-selected="false" tabIndex={-1} style={{'--c': 'var(--mint)'}}><span className="n">02</span> Range and depth</button>
          <button className="tab" role="tab" id="t3" aria-controls="p3" aria-selected="false" tabIndex={-1} style={{'--c': 'var(--lilac)'}}><span className="n">03</span> Systems over heroics</button>
          <button className="tab" role="tab" id="t4" aria-controls="p4" aria-selected="false" tabIndex={-1} style={{'--c': 'var(--pink)'}}><span className="n">04</span> Make it real</button>
          <button className="tab" role="tab" id="t5" aria-controls="p5" aria-selected="false" tabIndex={-1} style={{'--c': 'var(--tomato)'}}><span className="n">05</span> AI for speed</button>
          <button className="tab" role="tab" id="t6" aria-controls="p6" aria-selected="false" tabIndex={-1} style={{'--c': 'var(--cream)'}}><span className="n">06</span> Humans for taste</button>
        </div>
        <button className="tabs-pause mono" type="button" data-tabs-pause aria-controls="p1 p2 p3 p4 p5 p6">Pause</button>
        <div className="panel" role="tabpanel" id="p1" aria-labelledby="t1" style={{'--c': 'var(--sun)'}}>
          <div>
            <h3>Start with the outcome.</h3>
            <p className="body">Before pixels, I ask what has to change for the business and the user. A clear outcome makes every design decision easier to judge.</p>
            <p className="proof"><span className="mono">Rule in practice</span>Every brief opens with one line: what moves if this works.</p>
          </div>
          <figure><svg className="il il-target" viewBox="0 0 320 200" aria-hidden="true">
              <circle className="ring" cx={190} cy={100} r={72} />
              <circle className="ol" cx={190} cy={100} r={72} fill="var(--tomato)" /><circle className="ol" cx={190} cy={100} r={52} fill="var(--cream)" /><circle className="ol" cx={190} cy={100} r={32} fill="var(--tomato)" /><circle className="ol" cx={190} cy={100} r={13} fill="var(--cream)" />
              <g className="arrow"><path className="ol" d="M75.8 60.3L73.4 48.9L90.4 54.9L92.8 66.3Z" fill="var(--sun)" strokeWidth="2.6" /><path className="ol" d="M75.8 60.3L66.8 67.8L83.8 73.8L92.8 66.3Z" fill="var(--sun)" strokeWidth="2.6" /><path className="ol" d="M70 58.3L186 99" strokeWidth={5} /></g>
            </svg><figcaption className="note">what moves if this works?</figcaption></figure>
        </div>
        <div className="panel" role="tabpanel" id="p2" aria-labelledby="t2" style={{'--c': 'var(--mint)'}} hidden>
          <div>
            <h3>Hire for range, grow for depth.</h3>
            <p className="body">I hire curious people, then help each one own a craft. Teams grow when the people in them grow.</p>
            <p className="proof"><span className="mono">Rule in practice</span>Each designer has a growth plan we write together and revisit every quarter.</p>
          </div>
          <figure><svg className="il il-grow" viewBox="0 0 320 200" aria-hidden="true">
              <path className="spark" style={{'--d': '0s'}} d="M112 70l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="var(--sun)" />
              <path className="spark" style={{'--d': '1.2s'}} d="M214 52l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" fill="var(--cream)" />
              <g className="plant"><path className="ol stem" pathLength={1} d="M160 142C160 120 157 100 160 72" fill="none" strokeWidth={4} />
                <path className="ol leaf" style={{'--d': '.8s', '--o': '100% 100%'}} d="M158 116C138 116 126 104 124 90C142 90 154 100 158 116Z" fill="var(--mint)" />
                <path className="ol leaf" style={{'--d': '.95s', '--o': '0% 100%'}} d="M161 98C180 96 192 84 194 70C176 70 164 80 161 98Z" fill="var(--mint)" />
                <circle className="ol leaf" style={{'--d': '1.1s'}} cx={160} cy={66} r={9} fill="var(--sun)" /></g>
              <path className="ol" d="M131 152h58l-7 36h-44z" fill="var(--tomato)" /><rect className="ol" x={124} y={140} width={72} height={14} rx={4} fill="var(--tomato)" />
            </svg><figcaption className="note">people first</figcaption></figure>
        </div>
        <div className="panel" role="tabpanel" id="p3" aria-labelledby="t3" style={{'--c': 'var(--lilac)'}} hidden>
          <div>
            <h3>Systems over heroics.</h3>
            <p className="body">Quality shouldn’t depend on who’s in the room. Shared systems, review rituals and clear standards make good work repeatable.</p>
            <p className="proof"><span className="mono">Rule in practice</span>The design system comes first, then review gates before anything ships.</p>
          </div>
          <figure><svg className="il il-blocks" viewBox="0 0 320 200" aria-hidden="true">
              <path className="ol" d="M70 182h180" strokeWidth="3.5" />
              <g className="blk" style={{'--d': '.1s'}}><rect className="ol" x={104} y={136} width={62} height={44} rx={7} fill="var(--cobalt)" /><path d="M116 146h12v12h-12zM134 146h12v12h-12zM116 162h12v12h-12zM134 162h12v12h-12z" fill="var(--cream)" /></g>
              <g className="blk" style={{'--d': '.3s'}}><rect className="ol" x={168} y={136} width={52} height={44} rx={7} fill="var(--sun)" /><circle className="ol" cx={194} cy={158} r={10} fill="var(--cream)" strokeWidth="2.5" /></g>
              <g className="blk" style={{'--d': '.5s'}}><rect className="ol" x={124} y={90} width={76} height={44} rx={7} fill="var(--mint)" /><text x={162} y={120} className="aa">Aa</text></g>
              <g className="blk top" style={{'--d': '.7s'}}><rect className="ol" x={142} y={50} width={40} height={38} rx={7} fill="var(--pink)" /><rect className="ol" x={150} y={63} width={24} height={12} rx={6} fill="var(--cream)" strokeWidth="2.5" /><circle cx={168} cy={69} r={4} fill="var(--ink)" /></g>
            </svg><figcaption className="note">repeatable, not lucky</figcaption></figure>
        </div>
        <div className="panel" role="tabpanel" id="p4" aria-labelledby="t4" style={{'--c': 'var(--pink)'}} hidden>
          <div>
            <h3>Make it real early.</h3>
            <p className="body">Prototypes settle debates faster than decks. They travel across languages, time zones and teams.</p>
            <p className="proof"><span className="mono">Rule in practice</span>If we’re arguing, we’re prototyping.</p>
          </div>
          <figure><svg className="il il-proto" viewBox="0 0 320 200" aria-hidden="true">
              <g transform="rotate(-6 70 95)"><rect className="ol" x={38} y={58} width={66} height={78} rx={4} fill="var(--sun)" /><path d="M48 72h40M48 84h30M48 100h44M48 112h24" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" /></g>
              <path className="ol dr" pathLength={1} d="M108 82q16-22 34-6" fill="none" /><path className="ol dr" pathLength={1} style={{'--dd': '.55s'}} d="M134 70l9 7-10 5" fill="none" />
              <rect className="ol" x={160} y={16} width={86} height={170} rx={16} fill="var(--cream)" /><rect x={188} y={24} width={30} height={7} rx="3.5" fill="var(--ink)" />
              <rect className="ui" style={{'--d': '.5s'}} x={172} y={42} width={62} height={10} rx={4} fill="var(--ink)" />
              <rect className="ol ui" style={{'--d': '.65s'}} x={172} y={60} width={62} height={38} rx={7} fill="var(--lilac)" strokeWidth="2.5" />
              <rect className="ol ui" style={{'--d': '.8s'}} x={172} y={106} width={62} height={26} rx={7} fill="var(--mint)" strokeWidth="2.5" />
              <circle className="ripple" cx={203} cy={152} r={16} />
              <rect className="ol ui btnp" style={{'--d': '.95s'}} x={178} y={144} width={50} height={17} rx="8.5" fill="var(--cobalt)" strokeWidth="2.5" />
              <path className="ol cursor" d="M206 154v22l6-6 5 10 5-2-5-10h9z" fill="var(--cream)" strokeWidth="2.5" />
            </svg><figcaption className="note">show, don’t tell</figcaption></figure>
        </div>
        <div className="panel" role="tabpanel" id="p5" aria-labelledby="t5" style={{'--c': 'var(--tomato)'}} hidden>
          <div>
            <h3>AI for speed.</h3>
            <p className="body">AI drafts flows, explores variants, summarises research and turns components into working code. That frees the team for the problems that need people.</p>
            <p className="proof"><span className="mono">Rule in practice</span>Our AI tools draft from our design system, never from a blank page.</p>
          </div>
          <figure><svg className="il il-ai" viewBox="0 0 320 200" aria-hidden="true">
              <path className="speed" d="M146 58h14M140 102h20M146 146h14" />
              <g className="dcard" style={{'--d': '.3s'}}><rect x={170} y={38} width={112} height={38} rx={9} fill="var(--cream)" /><path d="M179 38h7v38h-7a9 9 0 0 1-9-9v-20a9 9 0 0 1 9-9z" fill="var(--sun)" /><rect className="ol" x={170} y={38} width={112} height={38} rx={9} fill="none" /><path d="M198 52h58M198 63h38" stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" /></g>
              <g className="dcard" style={{'--d': '.45s'}}><rect x={170} y={83} width={112} height={38} rx={9} fill="var(--cream)" /><path d="M179 83h7v38h-7a9 9 0 0 1-9-9v-20a9 9 0 0 1 9-9z" fill="var(--mint)" /><rect className="ol" x={170} y={83} width={112} height={38} rx={9} fill="none" /><path d="M198 97h64M198 108h32" stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" /></g>
              <g className="dcard" style={{'--d': '.6s'}}><rect x={170} y={128} width={112} height={38} rx={9} fill="var(--cream)" /><path d="M179 128h7v38h-7a9 9 0 0 1-9-9v-20a9 9 0 0 1 9-9z" fill="var(--lilac)" /><rect className="ol" x={170} y={128} width={112} height={38} rx={9} fill="none" /><path d="M198 142h50M198 153h42" stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" /></g>
              <g transform="translate(34 44) scale(2.7)"><path className="ol" d="M12 37q0-7 8-7t8 7z" fill="var(--lilac)" strokeWidth="1.6" />
                <g className="ahead"><path className="sig2" style={{'--s': '0s'}} d="M14.5 1.5q-2 3 0 6M25.5 1.5q2 3 0 6" /><path className="sig2" style={{'--s': '.5s'}} d="M11.5 0q-3 4.5 0 9M28.5 0q3 4.5 0 9" /><path className="ol" d="M20 9V5.5" strokeWidth="1.6" /><circle className="ol" cx={20} cy="4.5" r="2.4" fill="var(--sun)" strokeWidth="1.4" /><rect x="3.5" y={15} width={4} height={8} rx="1.5" fill="var(--ink)" /><rect x="32.5" y={15} width={4} height={8} rx="1.5" fill="var(--ink)" /><rect className="ol" x={7} y={9} width={26} height={21} rx={6} fill="var(--cobalt)" strokeWidth="1.6" /><rect x={11} y={13} width={18} height={12} rx={4} fill="var(--cream)" /><g className="ablink"><circle cx={16} cy={18} r={2} fill="var(--ink)" /><circle cx={24} cy={18} r={2} fill="var(--ink)" /></g><path d="M17 21.5q3 2 6 0" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" /></g></g>
            </svg><figcaption className="note">drafts in minutes</figcaption></figure>
        </div>
        <div className="panel" role="tabpanel" id="p6" aria-labelledby="t6" style={{'--c': 'var(--cream)'}} hidden>
          <div>
            <h3>Humans for taste.</h3>
            <p className="body">AI widens the options, and people choose. Judgment, ethics and craft stay with the team.</p>
            <p className="proof"><span className="mono">Rule in practice</span>Nothing ships without a designer’s review.</p>
          </div>
          <figure><svg className="il il-taste" viewBox="0 0 320 200" aria-hidden="true">
              <g className="opt" style={{'--d': '.05s'}}><rect className="ol" x={38} y={50} width={72} height={96} rx={9} fill="var(--cream)" /><rect x={48} y={60} width={52} height={40} rx={5} fill="var(--tomato)" /><path d="M50 114h40M50 126h28" stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" /></g>
              <g className="opt" style={{'--d': '.15s'}}><g className="pick"><rect className="ol" x={124} y={50} width={72} height={96} rx={9} fill="var(--cream)" stroke="var(--cobalt)" strokeWidth="3.5" /><rect x={134} y={60} width={52} height={40} rx={5} fill="var(--cobalt)" /><path d="M136 114h40M136 126h28" stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" />
                  <g className="badge"><circle className="ol" cx={190} cy={54} r={15} fill="var(--sun)" /><path d="M183 54l5 5 9-10" fill="none" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></g></g></g>
              <g className="opt" style={{'--d': '.25s'}}><rect className="ol" x={210} y={50} width={72} height={96} rx={9} fill="var(--cream)" /><rect x={220} y={60} width={52} height={40} rx={5} fill="var(--mint)" /><path d="M222 114h40M222 126h28" stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" /></g>
              <g className="mag"><circle className="ol" cx={0} cy={0} r={22} fill="rgba(255,255,255,.35)" strokeWidth={5} /><path className="ol" d="M16 16l16 16" strokeWidth={8} /></g>
            </svg><figcaption className="note">a designer signs off</figcaption></figure>
        </div>
      </div>
    </section>
  );
}
