const Footer = () => {
  return (
    <>
      <div
        className="p-5 mt-5"
        style={{ backgroundColor: "var(--primary-color)" }}
      >
        <div className="container text-white">
          <div className="row">
            <div className="col-12 col-md-6">
              <h3
                className="fw-bold"
                style={{ color: "var(--tertiary-color)" }}
              >
                Links
              </h3>
              <div className="d-flex gap-3">
                <span className="">Home</span>
                <span className="">About</span>
                <span className="">Schedule</span>
                <span className="">Pricing</span>
                <span className="">Contact</span>
                <span></span>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <h3
                className="fw-bold"
                style={{ color: "var(--tertiary-color)" }}
              >
                Hava a question?
              </h3>
              <div>090-080-0760</div>
              <div>hello@company.com</div>
            </div>
            <div className="col-12 col-md-3">
              <h3
                className="fw-bold"
                style={{ color: "var(--tertiary-color)" }}
              >
                Location
              </h3>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam,
                quis. Fugit impedit commodi perferendis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
