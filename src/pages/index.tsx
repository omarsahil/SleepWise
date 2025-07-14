import Link from "next/link";
import {
  BarChart2,
  ShieldCheck,
  Award,
  TrendingUp,
  Moon,
  Zap,
  Star,
} from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Landing() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <div className="relative min-h-screen bg-white">
      {/* Fixed SVG grid background for upper half */}
      <svg
        className="fixed top-0 left-0 w-screen h-[50vh] pointer-events-none z-0"
        viewBox="0 0 1920 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ minWidth: "100vw", minHeight: "50vh" }}
      >
        {/* Vertical grid lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={(i * 1920) / 20}
            y1="0"
            x2={(i * 1920) / 20}
            y2="540"
            stroke="#E5E7EB"
            strokeWidth="1"
            opacity="0.7"
          />
        ))}
        {/* Horizontal grid lines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={(i * 540) / 10}
            x2="1920"
            y2={(i * 540) / 10}
            stroke="#E5E7EB"
            strokeWidth="1"
            opacity="0.7"
          />
        ))}
      </svg>

      {/* Overlay a white div below the SVG to hide the grid after 50vh */}
      <div className="fixed top-[50vh] left-0 w-screen h-[50vh] bg-white z-10 pointer-events-none" />

      {/* Main content with higher z-index */}
      <main className="relative z-20">
        {/* HERO SECTION */}
        <div style={{ textAlign: "center", paddingTop: 100 }}>
          <h1
            style={{
              color: "#1e293b",
              fontSize: 48,
              fontWeight: 800,
              marginBottom: 16,
            }}
          >
            Sleepwise
          </h1>
          <h2
            style={{
              color: "#7C3AED",
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            Track, Analyze, and Improve Your Sleep
          </h2>
          <p
            style={{
              color: "#334155",
              fontSize: 20,
              maxWidth: 600,
              margin: "0 auto 32px",
            }}
          >
            Sleepwise gives you live analytics, personalized insights, and
            gamified progress to help you sleep better every night.
          </p>
          {/* Clerk Sign In Button as Get Started */}
          <SignInButton mode="modal">
            <button
              style={{
                background: "#7C3AED",
                color: "white",
                fontSize: 20,
                padding: "16px 48px",
                borderRadius: 12,
                fontWeight: 700,
                border: "none",
                boxShadow: "0 4px 24px #7C3AED22",
                cursor: "pointer",
              }}
            >
              Get Started
            </button>
          </SignInButton>
        </div>
        {/* FEATURES SECTION */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 32,
            maxWidth: 900,
            margin: "64px auto",
          }}
        >
          <div
            style={{
              background: "rgba(124,58,237,0.05)",
              borderRadius: 16,
              padding: 32,
              textAlign: "center",
              boxShadow: "0 2px 12px #7C3AED11",
            }}
          >
            <BarChart2
              size={32}
              style={{ color: "#7C3AED", marginBottom: 8 }}
            />
            <h3
              style={{
                color: "#1e293b",
                fontWeight: 700,
                fontSize: 20,
                marginBottom: 8,
              }}
            >
              Live Analytics
            </h3>
            <p style={{ color: "#334155", fontSize: 16 }}>
              Visualize your sleep patterns, duration, and quality with
              beautiful charts.
            </p>
          </div>
          <div
            style={{
              background: "rgba(124,58,237,0.05)",
              borderRadius: 16,
              padding: 32,
              textAlign: "center",
              boxShadow: "0 2px 12px #7C3AED11",
            }}
          >
            <TrendingUp
              size={32}
              style={{ color: "#A78BFA", marginBottom: 8 }}
            />
            <h3
              style={{
                color: "#1e293b",
                fontWeight: 700,
                fontSize: 20,
                marginBottom: 8,
              }}
            >
              Personalized Insights
            </h3>
            <p style={{ color: "#334155", fontSize: 16 }}>
              Get actionable tips, a composite Sleep Score, and see how your
              habits impact your rest.
            </p>
          </div>
          <div
            style={{
              background: "rgba(124,58,237,0.05)",
              borderRadius: 16,
              padding: 32,
              textAlign: "center",
              boxShadow: "0 2px 12px #7C3AED11",
            }}
          >
            <Award size={32} style={{ color: "#FBBF24", marginBottom: 8 }} />
            <h3
              style={{
                color: "#1e293b",
                fontWeight: 700,
                fontSize: 20,
                marginBottom: 8,
              }}
            >
              Gamification
            </h3>
            <p style={{ color: "#334155", fontSize: 16 }}>
              Earn badges, build streaks, and stay motivated to improve your
              sleep every night.
            </p>
          </div>
          <div
            style={{
              background: "rgba(124,58,237,0.05)",
              borderRadius: 16,
              padding: 32,
              textAlign: "center",
              boxShadow: "0 2px 12px #7C3AED11",
            }}
          >
            <ShieldCheck
              size={32}
              style={{ color: "#10B981", marginBottom: 8 }}
            />
            <h3
              style={{
                color: "#1e293b",
                fontWeight: 700,
                fontSize: 20,
                marginBottom: 8,
              }}
            >
              Private & Secure
            </h3>
            <p style={{ color: "#334155", fontSize: 16 }}>
              Your data is protected with Clerk authentication and stored
              securely in Supabase.
            </p>
          </div>
        </div>
        {/* HOW IT WORKS SECTION */}
        <div
          style={{
            maxWidth: 900,
            margin: "64px auto",
            background: "rgba(124,58,237,0.04)",
            borderRadius: 16,
            padding: 40,
            textAlign: "center",
            boxShadow: "0 2px 12px #7C3AED08",
          }}
        >
          <h2
            style={{
              color: "#7C3AED",
              fontWeight: 700,
              fontSize: 24,
              marginBottom: 32,
            }}
          >
            How Sleepwise Works
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 40,
            }}
          >
            <div style={{ flex: "1 1 200px", minWidth: 200 }}>
              <Zap style={{ color: "#7C3AED", marginBottom: 8 }} size={28} />
              <div
                style={{
                  color: "#1e293b",
                  fontWeight: 600,
                  fontSize: 18,
                  marginBottom: 4,
                }}
              >
                1. Sign Up
              </div>
              <div style={{ color: "#334155", fontSize: 15 }}>
                Create your account securely with Clerk.
              </div>
            </div>
            <div style={{ flex: "1 1 200px", minWidth: 200 }}>
              <BarChart2
                style={{ color: "#A78BFA", marginBottom: 8 }}
                size={28}
              />
              <div
                style={{
                  color: "#1e293b",
                  fontWeight: 600,
                  fontSize: 18,
                  marginBottom: 4,
                }}
              >
                2. Log Your Sleep
              </div>
              <div style={{ color: "#334155", fontSize: 15 }}>
                Easily record your sleep times and quality each day.
              </div>
            </div>
            <div style={{ flex: "1 1 200px", minWidth: 200 }}>
              <TrendingUp
                style={{ color: "#10B981", marginBottom: 8 }}
                size={28}
              />
              <div
                style={{
                  color: "#1e293b",
                  fontWeight: 600,
                  fontSize: 18,
                  marginBottom: 4,
                }}
              >
                3. Get Insights
              </div>
              <div style={{ color: "#334155", fontSize: 15 }}>
                See trends, analytics, and personalized tips to improve your
                sleep.
              </div>
            </div>
          </div>
        </div>
        {/* TESTIMONIALS SECTION */}
        <div
          style={{
            maxWidth: 700,
            margin: "64px auto",
            background: "rgba(124,58,237,0.04)",
            borderRadius: 16,
            padding: 40,
            textAlign: "center",
            boxShadow: "0 2px 12px #7C3AED08",
          }}
        >
          <h3
            style={{
              color: "#7C3AED",
              fontWeight: 700,
              fontSize: 22,
              marginBottom: 24,
            }}
          >
            What Our Users Say
          </h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 32,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                flex: "1 1 250px",
                minWidth: 220,
                background: "rgba(124,58,237,0.07)",
                borderRadius: 12,
                padding: 24,
              }}
            >
              <p
                style={{
                  color: "#1e293b",
                  fontStyle: "italic",
                  marginBottom: 8,
                }}
              >
                “Sleepwise helped me finally understand my sleep patterns. The
                insights are spot on!”
              </p>
              <span style={{ color: "#7C3AED", fontWeight: 600 }}>— Alex</span>
            </div>
            <div
              style={{
                flex: "1 1 250px",
                minWidth: 220,
                background: "rgba(124,58,237,0.07)",
                borderRadius: 12,
                padding: 24,
              }}
            >
              <p
                style={{
                  color: "#1e293b",
                  fontStyle: "italic",
                  marginBottom: 8,
                }}
              >
                “The gamification keeps me motivated. I love earning badges for
                my streaks!”
              </p>
              <span style={{ color: "#A78BFA", fontWeight: 600 }}>— Jamie</span>
            </div>
          </div>
        </div>
        {/* FOOTER */}
        <footer
          style={{
            marginTop: 48,
            color: "#64748b",
            fontSize: 14,
            textAlign: "center",
            paddingBottom: 32,
          }}
        >
          &copy; {new Date().getFullYear()} Sleepwise &mdash; Track, Analyze,
          Improve. <br />
          <Link
            href="/privacy"
            style={{ color: "#7C3AED", textDecoration: "underline" }}
          >
            Privacy Policy
          </Link>
        </footer>
      </main>
    </div>
  );
}
