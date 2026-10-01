"use client";

import { useEffect, useState } from "react";

const OPENSEA_URL = "https://opensea.io/collection/chromiq";
const HOME_URL = "/";

const nfts = [
  { id: 1, image: "/nfts/1.svg" },
  { id: 2, image: "/nfts/2.svg" },
  { id: 3, image: "/nfts/3.svg" },
  { id: 4, image: "/nfts/4.svg" },
  { id: 5, image: "/nfts/5.svg" },
  { id: 6, image: "/nfts/6.svg" },
  { id: 7, image: "/nfts/7.svg" },
  { id: 8, image: "/nfts/8.svg" },
  { id: 9, image: "/nfts/9.svg" },
  { id: 10, image: "/nfts/10.svg" },
  { id: 11, image: "/nfts/11.svg" },
  { id: 12, image: "/nfts/12.svg" },
  { id: 13, image: "/nfts/13.svg" },
  { id: 14, image: "/nfts/14.svg" },
  { id: 15, image: "/nfts/15.svg" },
  { id: 16, image: "/nfts/16.svg" },
  { id: 17, image: "/nfts/17.svg" },
  { id: 18, image: "/nfts/18.svg" },
  { id: 19, image: "/nfts/19.svg" },
  { id: 20, image: "/nfts/20.svg" },
];

export default function NFTsPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="page">
      {/* Animated background */}
      <div className="background">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
        <div className="grid" />
      </div>

      {/* Floating particles */}
      <div className="particles">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 61) % 100}%`,
              animationDelay: `${(i % 8) * 0.6}s`,
            }}
          />
        ))}
      </div>

      <div className={`content ${loaded ? "show" : ""}`}>
        {/* Header */}
        <header className="hero">
          <div className="badge">
            <span className="pulse" />
            BUILT ON BASE
          </div>

          <h1>
            <span className="gradientText">CHROMIQ</span>
          </h1>

          <h2>Fully On-Chain Animated Generative NFTs</h2>

          <p className="intro">
            Chromiq is a 10,000-piece fully on-chain animated generative NFT
            collection built on Base.
          </p>

          <p className="intro secondary">
            Each Chromiq is created through code and designed around
            generative art, combining unique colors, traits, patterns,
            characters, and animations.
          </p>

          {/* Buttons */}
          <div className="buttons">
            <a
              href={OPENSEA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="primaryButton"
            >
              <span>Explore on OpenSea</span>
              <span className="arrow">↗</span>
            </a>

            <a href={HOME_URL} className="secondaryButton">
              Back to Home
            </a>
          </div>
        </header>

        {/* Vision */}
        <section className="section vision">
          <div className="sectionLabel">01 — THE VISION</div>

          <h2>Where code becomes art.</h2>

          <p>
            The goal of Chromiq is to explore the possibilities of fully
            on-chain generative NFT art.
          </p>

          <p>
            By building the artwork around on-chain technology, Chromiq
            connects <strong>code, creativity, ownership, and blockchain
            technology</strong> in one collection.
          </p>
        </section>

        {/* Collection stats */}
        <section className="stats">
          <div className="statCard">
            <strong>10,000</strong>
            <span>Unique NFTs</span>
          </div>

          <div className="statCard">
            <strong>BASE</strong>
            <span>Blockchain</span>
          </div>

          <div className="statCard">
            <strong>ERC-721</strong>
            <span>Standard</span>
          </div>

          <div className="statCard">
            <strong>ON-CHAIN</strong>
            <span>Generative Art</span>
          </div>
        </section>

        {/* Collection */}
        <section className="section">
          <div className="sectionLabel">02 — THE COLLECTION</div>

          <h2>10,000 unique identities.</h2>

          <p>
            Every Chromiq combines different traits, colors, patterns and
            animations to create a distinctive digital identity.
          </p>
        </section>

        {/* NFT Gallery */}
        <section className="gallerySection">
          <div className="sectionLabel">03 — FEATURED CHROMIQ</div>

          <h2>Explore the collection.</h2>

          <p className="galleryIntro">
            A selection of Chromiq NFTs from the collection.
          </p>

          <div className="gallery">
            {nfts.map((nft, index) => (
              <a
                key={nft.id}
                href={`${OPENSEA_URL}/${nft.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="nftCard"
                style={{
                  animationDelay: `${index * 70}ms`,
                }}
              >
                <div className="imageWrap">
                  <img
                    src={nft.image}
                    alt={`Chromiq #${nft.id} — fully on-chain animated generative NFT`}
                    loading="lazy"
                  />

                  <div className="scanLine" />
                  <div className="imageGlow" />
                </div>

                <div className="nftInfo">
                  <span>CHROMIQ</span>
                  <strong>#{nft.id}</strong>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="final">
          <div className="finalGlow" />

          <div className="sectionLabel">04 — DISCOVER CHROMIQ</div>

          <h2>
            The blockchain is
            <br />
            part of the artwork.
          </h2>

          <p>
            Explore the complete Chromiq collection on OpenSea.
          </p>

          <a
            href={OPENSEA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="primaryButton large"
          >
            View Full Collection
            <span className="arrow">↗</span>
          </a>
        </section>

        <footer>
          <span>© {new Date().getFullYear()} Chromiq</span>
          <span>Fully On-Chain • Built on Base</span>
        </footer>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #050509;
          color: #ffffff;
          position: relative;
          overflow: hidden;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .background {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .grid {
          position: absolute;
          inset: 0;
          opacity: 0.12;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.06) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.06) 1px,
              transparent 1px
            );
          background-size: 70px 70px;
          mask-image: linear-gradient(to bottom, black, transparent 80%);
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.25;
          animation: float 12s ease-in-out infinite alternate;
        }

        .orb1 {
          width: 420px;
          height: 420px;
          background: #6d5dfc;
          top: -160px;
          left: -100px;
        }

        .orb2 {
          width: 360px;
          height: 360px;
          background: #00d9ff;
          right: -120px;
          top: 500px;
          animation-delay: -4s;
        }

        .orb3 {
          width: 300px;
          height: 300px;
          background: #ff38b8;
          left: 40%;
          bottom: -180px;
          animation-delay: -7s;
        }

        @keyframes float {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }

          to {
            transform: translate3d(30px, -40px, 0) scale(1.12);
          }
        }

        .particles {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: white;
          opacity: 0.3;
          animation: particleFloat 5s ease-in-out infinite;
        }

        @keyframes particleFloat {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.15;
          }

          50% {
            transform: translateY(-35px);
            opacity: 0.8;
          }
        }

        .content {
          position: relative;
          z-index: 2;
          max-width: 1180px;
          margin: auto;
          padding: 0 24px;
          opacity: 0;
          transform: translateY(20px);
          transition: 1s ease;
        }

        .content.show {
          opacity: 1;
          transform: translateY(0);
        }

        .hero {
          min-height: 850px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          padding: 100px 0 80px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 14px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          font-size: 11px;
          letter-spacing: 0.16em;
          margin-bottom: 28px;
        }

        .pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #00ff9d;
          box-shadow: 0 0 15px #00ff9d;
          animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.6);
            opacity: 0.5;
          }
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(70px, 15vw, 170px);
          line-height: 0.8;
          letter-spacing: -0.08em;
        }

        .gradientText {
          background: linear-gradient(
            100deg,
            #ffffff,
            #b8a8ff,
            #70eaff,
            #ffffff
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gradientMove 5s linear infinite;
        }

        @keyframes gradientMove {
          to {
            background-position: 300% center;
          }
        }

        .hero h2 {
          font-size: clamp(22px, 4vw, 40px);
          margin: 38px 0 18px;
          letter-spacing: -0.03em;
        }

        .intro {
          max-width: 720px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 18px;
          line-height: 1.7;
          margin: 0 auto;
        }

        .intro.secondary {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.48);
          margin-top: 10px;
        }

        .buttons {
          display: flex;
          gap: 12px;
          margin-top: 38px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .primaryButton,
        .secondaryButton {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 15px 22px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 700;
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease,
            background 0.3s ease;
        }

        .primaryButton {
          color: #050509;
          background: white;
          box-shadow: 0 0 35px rgba(255, 255, 255, 0.12);
        }

        .primaryButton:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 50px rgba(255, 255, 255, 0.2);
        }

        .secondaryButton {
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.05);
        }

        .secondaryButton:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.1);
        }

        .arrow {
          font-size: 20px;
        }

        .section {
          padding: 120px 0;
          max-width: 820px;
          margin: auto;
          text-align: center;
        }

        .sectionLabel {
          color: rgba(255, 255, 255, 0.38);
          font-size: 11px;
          letter-spacing: 0.2em;
          margin-bottom: 24px;
        }

        .section h2 {
          font-size: clamp(36px, 6vw, 68px);
          letter-spacing: -0.05em;
          margin: 0 0 24px;
        }

        .section p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 17px;
          line-height: 1.8;
        }

        .section strong {
          color: white;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin: 40px 0 80px;
        }

        .statCard {
          padding: 28px 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.035);
          backdrop-filter: blur(15px);
          transition:
            transform 0.3s ease,
            border-color 0.3s ease;
        }

        .statCard:hover {
          transform: translateY(-7px);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .statCard strong {
          display: block;
          font-size: 22px;
          margin-bottom: 8px;
        }

        .statCard span {
          color: rgba(255, 255, 255, 0.42);
          font-size: 12px;
        }

        .gallerySection {
          padding: 120px 0;
        }

        .gallerySection h2 {
          font-size: clamp(40px, 7vw, 75px);
          letter-spacing: -0.06em;
          margin: 0 0 14px;
        }

        .galleryIntro {
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 45px;
        }

        .gallery {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .nftCard {
          position: relative;
          overflow: hidden;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.09);
          text-decoration: none;
          color: white;
          opacity: 0;
          animation: cardIn 0.7s ease forwards;
          transition:
            transform 0.4s ease,
            border-color 0.4s ease,
            box-shadow 0.4s ease;
        }

        @keyframes cardIn {
          to {
            opacity: 1;
          }
        }

        .nftCard:hover {
          transform: translateY(-9px) scale(1.015);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.45);
        }

        .imageWrap {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          background: #0b0b12;
        }

        .imageWrap img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition:
            transform 0.6s ease,
            filter 0.6s ease;
        }

        .nftCard:hover img {
          transform: scale(1.08);
          filter: brightness(1.12) saturate(1.1);
        }

        .imageGlow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            circle at 50% 0%,
            rgba(255, 255, 255, 0.15),
            transparent 55%
          );
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .nftCard:hover .imageGlow {
          opacity: 1;
        }

        .scanLine {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          top: -10%;
          background: rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
          opacity: 0;
        }

        .nftCard:hover .scanLine {
          opacity: 1;
          animation: scan 1.5s linear infinite;
        }

        @keyframes scan {
          from {
            top: 0%;
          }

          to {
            top: 100%;
          }
        }

        .nftInfo {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
        }

        .nftInfo span {
          color: rgba(255, 255, 255, 0.38);
          font-size: 10px;
          letter-spacing: 0.15em;
        }

        .nftInfo strong {
          font-size: 14px;
        }

        .final {
          position: relative;
          padding: 180px 20px;
          text-align: center;
          overflow: hidden;
        }

        .finalGlow {
          position: absolute;
          width: 500px;
          height: 500px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: #6655ff;
          opacity: 0.12;
          filter: blur(100px);
          pointer-events: none;
        }

        .final h2 {
          position: relative;
          font-size: clamp(42px, 8vw, 90px);
          line-height: 0.95;
          letter-spacing: -0.07em;
          margin: 0 0 28px;
        }

        .final p {
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 35px;
        }

        .large {
          position: relative;
          padding: 17px 28px;
        }

        footer {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 28px 0 40px;
          display: flex;
          justify-content: space-between;
          color: rgba(255, 255, 255, 0.3);
          font-size: 12px;
        }

        @media (max-width: 850px) {
          .gallery {
            grid-template-columns: repeat(2, 1fr);
          }

          .stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .hero {
            min-height: 700px;
          }
        }

        @media (max-width: 520px) {
          .content {
            padding: 0 15px;
          }

          .gallery {
            grid-template-columns: repeat(2, 1fr);
            gap: 9px;
          }

          .nftCard {
            border-radius: 15px;
          }

          .nftInfo {
            padding: 10px;
          }

          .nftInfo span {
            font-size: 8px;
          }

          .stats {
            gap: 8px;
          }

          .statCard {
            padding: 22px 8px;
          }

          footer {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </main>
  );
}
