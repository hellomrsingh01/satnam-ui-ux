export default function Contact() {
  return (
    <footer className="contact" id="contact">
      <div className="wrap">
        <div className="contact-main">
          <div className="contact-copy">
            <p className="kicker mono">06 · Hiring for design roles?</p>
            <h2 className="pop">Your <span className="y">move.</span></h2>
            <p className="sub pop">Tell me about the team you’re building. I’m in Chandigarh (IST) and already work across time zones with teams in Singapore, Vietnam, Japan, the UK, the US and Canada.</p>
            <div className="contact-ctas pop">
              <a className="btn sun" href="mailto:hellosatnamsingh01@gmail.com"><svg className="ei ei-envelope" viewBox="0 0 24 24" aria-hidden="true"><path className="e-heart" d="M12 9.6c-1.6-1.6-4-.6-4 1.4 0 1.8 2.3 3.2 4 4.6 1.7-1.4 4-2.8 4-4.6 0-2-2.4-3-4-1.4z" fill="var(--tomato)" stroke="var(--ink)" strokeWidth="1.1" /><rect className="eo" x="2.5" y={7} width={19} height={13} rx={2} fill="var(--cream)" /><path className="eo" d="M3.2 8l8.8 6.4L20.8 8" fill="none" /></svg> hellosatnamsingh01@gmail.com</a>
              <button className="btn cream" type="button" data-copy="hellosatnamsingh01@gmail.com">Copy email</button>
            </div>
          </div>
          <figure className="contact-me" aria-hidden="true"><img src="/assets/portrait-pointing.webp" alt="" width={836} height={900} loading="lazy" /></figure>
        </div>
        <div className="foot">
          <span>Designed and built by Satnam · 2026</span>
          <span data-clock-foot>Chandigarh, IST</span>
          <a href="#top">Back to the start ↑</a>
        </div>
      </div>
    </footer>
  );
}
