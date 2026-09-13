/**
 * Aajera Banu S — Cloud & DevOps Engineer Portfolio
 * Clean, Human-Crafted Interactive Engine with Light/Dark Mode
 */

/* ============================================================
   AI HERO SLIDESHOW — Rapid image switcher with crossfade
   ============================================================ */
(function initAISlideshow() {
  const SWITCH_INTERVAL = 2500;   // ms between auto-switches
  const HOVER_INTERVAL  = 1200;   // ms on hover (faster/snappier)

  function startSlideshow(slides, frame) {
    let current = 0;
    let timer;

    function showSlide(idx) {
      slides.forEach((s, i) => {
        s.classList.toggle('slide-active', i === idx);
      });
    }

    function next() {
      current = (current + 1) % slides.length;
      showSlide(current);
    }

    function run(interval) {
      clearInterval(timer);
      timer = setInterval(next, interval);
    }

    // Start at normal speed
    run(SWITCH_INTERVAL);

    // Hover: go faster
    frame.addEventListener('mouseenter', () => run(HOVER_INTERVAL));
    frame.addEventListener('mouseleave', () => run(SWITCH_INTERVAL));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const frame  = document.querySelector('.ai-frame');
    const slides = Array.from(document.querySelectorAll('.slide-img'));
    if (frame && slides.length >= 2) startSlideshow(slides, frame);
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  // Update year
  const yearSpan = document.getElementById('year-span');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* ==========================================================================
     1. Theme Engine: Default Light Mode with Seamless Dark Mode Toggle
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const root = document.documentElement;

  // Set default to 'light' unless user has explicitly saved a preference
  const currentTheme = localStorage.getItem('aajera_theme_pref') || 'light';
  root.setAttribute('data-theme', currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = root.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('aajera_theme_pref', newTheme);
      showToast(newTheme === 'dark' ? '🌙 Dark Mode Activated' : '☀️ Light Mode Activated');
    });
  }

  /* ==========================================================================
     2. Mobile Drawer Navigation
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const mobileDrawer = document.getElementById('mobile-menu-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');

  function openMobileMenu() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMobileMenu();
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMobileMenu();
      });
    }

    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', closeMobileMenu);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    document.querySelectorAll('.drawer-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);

          // 1. Close the drawer first
          closeMobileMenu();

          // 2. Wait for the drawer to slide completely off-screen (260ms) before scrolling
          // This eliminates the jarring effect where the sidebar moves across the viewport while the page scrolls
          if (target) {
            setTimeout(() => {
              const headerEl = document.querySelector('.site-header');
              const headerOffset = headerEl ? headerEl.offsetHeight : 70;
              const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset - 10;
              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
              });
            }, 260);
          }
        } else {
          closeMobileMenu();
        }
      });
    });
  }

  /* ==========================================================================
     3. Interactive CI/CD Pipeline Simulator
     ========================================================================== */
  const triggerPipelineBtn = document.getElementById('trigger-pipeline-btn');
  const pipelineStream = document.getElementById('pipeline-stream');
  const node1 = document.getElementById('node-1');
  const node2 = document.getElementById('node-2');
  const node3 = document.getElementById('node-3');
  const node4 = document.getElementById('node-4');
  const node5 = document.getElementById('node-5');

  const pipelineStages = [
    {
      node: node1,
      name: 'Git Webhook',
      logs: [
        '[GitHub Actions] Webhook payload verified for commit #a0508f9 (branch: main)',
        '[Git] Pulling latest commits... 4 files changed, 142 insertions(+).'
      ]
    },
    {
      node: node2,
      name: 'Lint & Test Suite',
      logs: [
        '[Test] Running ESLint, Prettier & ShellCheck... All passed (0 errors).',
        '[Test] Executing 18 unit tests and 4 integration tests... 100% Passed.'
      ]
    },
    {
      node: node3,
      name: 'Docker Container Build',
      logs: [
        '[Docker] Compiling dependencies in multi-stage builder...',
        '[Docker] Layer caching optimized. Production image size: 38MB.',
        '[Docker] Pushing container to AWS ECR registry... [SUCCESS]'
      ]
    },
    {
      node: node4,
      name: 'Terraform IaC Provisioning',
      logs: [
        '[Terraform] Synchronizing remote state backend (S3 + DynamoDB lock).',
        '[Terraform] Plan: 0 to add, 1 to update (rolling container deployment).',
        '[Terraform] Apply complete. Cloud infrastructure synchronized.'
      ]
    },
    {
      node: node5,
      name: 'AWS ECS Deployment',
      logs: [
        '[AWS] Target Group health check: status 200 OK.',
        '[Nginx] Reverse proxy upstream reloaded without connection drop.',
        '[Deploy] Service is live and handling traffic 🟢.'
      ]
    }
  ];

  let isRunningPipeline = false;

  function streamLog(text, isHighlight = false) {
    if (!pipelineStream) return;
    const row = document.createElement('div');
    row.className = 'log-entry';
    const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
    row.innerHTML = `<span style="color: #64748b;">[${ts}]</span> ${isHighlight ? '<span style="color: #38bdf8; font-weight: 600;">' + text + '</span>' : text}`;
    pipelineStream.appendChild(row);
    pipelineStream.scrollTop = pipelineStream.scrollHeight;
  }

  if (triggerPipelineBtn) {
    triggerPipelineBtn.addEventListener('click', async () => {
      if (isRunningPipeline) return;
      isRunningPipeline = true;
      triggerPipelineBtn.disabled = true;
      triggerPipelineBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Deploying...</span>';

      // Reset nodes
      pipelineStages.forEach((s) => {
        s.node.className = 'pipe-node';
        s.node.querySelector('.node-badge-status').textContent = 'Queued';
      });
      document.querySelectorAll('.node-bar').forEach((b) => b.classList.remove('active'));
      pipelineStream.innerHTML = '';
      streamLog('=== INITIATING AUTOMATED DEVOPS CI/CD PIPELINE ===', true);

      for (let i = 0; i < pipelineStages.length; i++) {
        const stage = pipelineStages[i];
        stage.node.classList.add('running');
        stage.node.querySelector('.node-badge-status').textContent = 'Running...';

        streamLog(`--> Stage ${i + 1}/${pipelineStages.length}: Starting ${stage.name}...`, true);

        for (const log of stage.logs) {
          await new Promise((r) => setTimeout(r, 500));
          streamLog(log);
        }

        await new Promise((r) => setTimeout(r, 300));
        stage.node.classList.remove('running');
        stage.node.classList.add('success');
        stage.node.querySelector('.node-badge-status').textContent = 'Passed 🟢';

        const bars = document.querySelectorAll('.node-bar');
        if (bars[i]) {
          bars[i].classList.add('active');
        }
      }

      streamLog('✅ PIPELINE COMPLETED: Production deployment verified healthy.', true);
      showToast('🚀 Pipeline completed successfully! All services 100% healthy.');

      triggerPipelineBtn.disabled = false;
      triggerPipelineBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> <span>Re-trigger Pipeline</span>';
      isRunningPipeline = false;
    });
  }

  /* ==========================================================================
     4. Project Architecture Modal
     ========================================================================== */

  /* ==========================================================================
     5. Project Architecture Modal
     ========================================================================== */
  const projectModal = document.getElementById('project-modal');
  const modalProjectTitle = document.getElementById('modal-project-title');
  const modalProjectContent = document.getElementById('modal-project-content');
  const closeProjectModal = document.getElementById('close-project-modal');

  const projectDetails = {
    terraform: {
      title: 'AWS Multi-Tier Infrastructure as Code (IaC) with Terraform',
      html: `
        <img src="assets/images/project-terraform.jpg" style="width: 100%; height: 240px; object-fit: cover; border-radius: 8px; margin-bottom: 1.2rem; border: 1px solid var(--border-color);" />
        <h4 style="color: var(--accent); margin-bottom: 0.5rem; font-size: 1.1rem;">Architecture Overview & Highlights</h4>
        <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.65; margin-bottom: 1rem;">
          Production-grade AWS topology provisioned using reusable Terraform modules with state locking to guarantee reproducibility across environments.
        </p>
        <div style="background: var(--bg-subtle); padding: 1.2rem; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 1.4rem;">
          <h5 style="color: var(--text-primary); margin-bottom: 0.5rem; font-size: 0.9rem;">Architectural Components:</h5>
          <ul style="color: var(--text-secondary); font-size: 0.85rem; padding-left: 1.2rem; line-height: 1.8;">
            <li><strong>VPC Network:</strong> <code>10.0.0.0/16</code> VPC partitioned into public and private subnets across 2 Availability Zones.</li>
            <li><strong>Gateways:</strong> Internet Gateway for public facing resources and NAT Gateway for private backend compute.</li>
            <li><strong>Compute & IAM:</strong> EC2 instances configured with strict IAM role access and S3 backend state locking.</li>
          </ul>
        </div>
        <a href="https://github.com/aajerabanu0508" target="_blank" class="btn-primary"><i class="fa-brands fa-github"></i> View GitHub Repository</a>
      `
    },
    cicd: {
      title: 'Automated CI/CD Pipeline for Microservices',
      html: `
        <img src="assets/images/project-cicd.jpg" style="width: 100%; height: 240px; object-fit: cover; border-radius: 8px; margin-bottom: 1.2rem; border: 1px solid var(--border-color);" />
        <h4 style="color: var(--accent); margin-bottom: 0.5rem; font-size: 1.1rem;">Pipeline Automation Workflow</h4>
        <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.65; margin-bottom: 1rem;">
          Continuous integration and deployment workflow executing linting, unit tests, multi-stage Docker builds, and automated cloud deployments on merge events.
        </p>
        <div style="background: var(--bg-subtle); padding: 1.2rem; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 1.4rem;">
          <h5 style="color: var(--text-primary); margin-bottom: 0.5rem; font-size: 0.9rem;">Automation Capabilities:</h5>
          <ul style="color: var(--text-secondary); font-size: 0.85rem; padding-left: 1.2rem; line-height: 1.8;">
            <li><strong>Multi-stage Builds:</strong> Minimizes final container footprint to &lt;40MB.</li>
            <li><strong>Automated Triggers:</strong> Webhook execution on branch pull requests and main branch merges.</li>
            <li><strong>Zero-Downtime Deployment:</strong> Health check validations before traffic switchover.</li>
          </ul>
        </div>
        <a href="https://github.com/aajerabanu0508" target="_blank" class="btn-primary"><i class="fa-brands fa-github"></i> View GitHub Repository</a>
      `
    },
    nginx: {
      title: 'High-Availability Nginx Reverse Proxy & Multi-Service Stack',
      html: `
        <img src="assets/images/project-nginx.jpg" style="width: 100%; height: 240px; object-fit: cover; border-radius: 8px; margin-bottom: 1.2rem; border: 1px solid var(--border-color);" />
        <h4 style="color: var(--accent); margin-bottom: 0.5rem; font-size: 1.1rem;">Reverse Proxy & Routing Strategy</h4>
        <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.65; margin-bottom: 1rem;">
          Edge proxy routing traffic across containerized microservices with SSL/TLS termination and load balancing.
        </p>
        <div style="background: var(--bg-subtle); padding: 1.2rem; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 1.4rem;">
          <h5 style="color: var(--text-primary); margin-bottom: 0.5rem; font-size: 0.9rem;">Features:</h5>
          <ul style="color: var(--text-secondary); font-size: 0.85rem; padding-left: 1.2rem; line-height: 1.8;">
            <li><strong>SSL/TLS Handshake:</strong> Modern TLS 1.3 protocol and hardened security headers.</li>
            <li><strong>Upstream Load Balancing:</strong> Round-robin and least-connections routing with active health monitoring.</li>
            <li><strong>Orchestration:</strong> Docker Compose multi-container networking.</li>
          </ul>
        </div>
        <a href="https://github.com/aajerabanu0508" target="_blank" class="btn-primary"><i class="fa-brands fa-github"></i> View GitHub Repository</a>
      `
    }
  };

  document.querySelectorAll('.project-modal-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-project');
      if (projectDetails[key] && projectModal) {
        modalProjectTitle.textContent = projectDetails[key].title;
        modalProjectContent.innerHTML = projectDetails[key].html;
        projectModal.classList.add('active');
      }
    });
  });

  if (closeProjectModal && projectModal) {
    closeProjectModal.addEventListener('click', () => {
      projectModal.classList.remove('active');
    });
  }

  /* ==========================================================================
     6. Resume / CV Modal
     ========================================================================== */
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const heroResumeTrigger = document.getElementById('hero-resume-trigger');
  const drawerResumeBtn = document.getElementById('drawer-resume-btn');
  const closeResumeModal = document.getElementById('close-resume-modal');
  const printCvBtn = document.getElementById('print-cv-btn');

  function openCv() {
    if (resumeModal) resumeModal.classList.add('active');
  }

  function closeCv() {
    if (resumeModal) resumeModal.classList.remove('active');
  }

  if (openResumeBtn) openResumeBtn.addEventListener('click', openCv);
  if (heroResumeTrigger) heroResumeTrigger.addEventListener('click', openCv);
  if (drawerResumeBtn) {
    drawerResumeBtn.addEventListener('click', () => {
      closeMobileMenu();
      openCv();
    });
  }
  if (closeResumeModal) closeResumeModal.addEventListener('click', closeCv);

  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeCv();
    if (e.target === projectModal) projectModal.classList.remove('active');
  });

  /* ==========================================================================
     7. Copy Email Action
     ========================================================================== */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'aajera.banu05@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('📋 Email copied: ' + email);
        copyEmailBtn.innerHTML = '<i class="fa-solid fa-check text-accent"></i>';
        setTimeout(() => {
          copyEmailBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
        }, 2500);
      });
    });
  }

  /* ==========================================================================
     8. Contact Form Dispatch Handler (Formspree Integration)
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('contact-submit-btn') || contactForm.querySelector('button[type="submit"]');
      const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending Message...</span>';
      }

      if (formStatus) formStatus.innerHTML = '';

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://formspree.io/f/xvkojzpr', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          showToast('✅ Thank you! Your message has been sent to Aajera Banu.');
          if (formStatus) {
            formStatus.innerHTML = '<div class="form-status-success"><i class="fa-solid fa-circle-check"></i> Thank you! Your message was delivered directly to Aajera\'s inbox.</div>';
          }
          contactForm.reset();
        } else {
          const data = await response.json().catch(() => ({}));
          const errorMsg = data && data.errors && data.errors.length
            ? data.errors.map((err) => err.message).join(', ')
            : 'Oops! There was an issue submitting your message. Please try again.';
          showToast('⚠️ ' + errorMsg);
          if (formStatus) {
            formStatus.innerHTML = `<div class="form-status-error"><i class="fa-solid fa-triangle-exclamation"></i> ${errorMsg}</div>`;
          }
        }
      } catch (err) {
        showToast('⚠️ Network connection issue. Please try again.');
        if (formStatus) {
          formStatus.innerHTML = '<div class="form-status-error"><i class="fa-solid fa-triangle-exclamation"></i> Unable to send message. Please check your connection or email directly at aajera.banu05@gmail.com.</div>';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnContent;
        }
      }
    });
  }

  /* ==========================================================================
     9. Blog Category Filters
     ========================================================================== */
  const blogFilterPills = document.querySelectorAll('.blog-filters .filter-pill');
  const blogCards = document.querySelectorAll('.blog-cards-grid .blog-card');

  blogFilterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      blogFilterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      blogCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     10. Article / Blog Reader Modal
     ========================================================================== */
  const articleModal = document.getElementById('article-modal');
  const closeArticleModal = document.getElementById('close-article-modal');
  const modalArticleCategory = document.getElementById('modal-article-category');
  const modalArticleTitle = document.getElementById('modal-article-title');
  const modalArticleContent = document.getElementById('modal-article-content');

  const articleDetails = {
    'vpc-architecture': {
      category: 'AWS & Cloud Architecture',
      title: 'AWS Multi-AZ VPC Architecture: Designing Fault-Tolerant Enterprise Networks',
      content: `
        <div class="article-callout-box">
          <p><strong>Core Concept:</strong> High Availability in AWS begins with proper network isolation. A well-designed VPC separates internet-facing ingress points from sensitive application workloads and databases.</p>
        </div>

        <h4>1. Multi-AZ Subnet Allocation</h4>
        <p>In this enterprise topology, subnets are symmetrically deployed across two Availability Zones (e.g., <code>us-east-1a</code> and <code>us-east-1b</code>):</p>
        <ul>
          <li><strong>Public Subnets (CIDR /24):</strong> Host Internet-facing Application Load Balancers and Bastion Hosts with an attached Internet Gateway.</li>
          <li><strong>Private App Subnets (CIDR /24):</strong> Host EC2 auto-scaling groups and containerized application tasks. Outbound internet is securely routed via redundant NAT Gateways.</li>
          <li><strong>Isolated Database Subnets (CIDR /24):</strong> Host Amazon RDS Aurora clusters with strictly zero internet ingress/egress routes.</li>
        </ul>

        <h4>2. Security Layering & Route Tables</h4>
        <p>Network isolation is maintained through a two-tiered defense mechanism:</p>
        <ul>
          <li><strong>Stateful Security Groups:</strong> Apply least-privilege rules directly at the ENI level (e.g., App tier accepts traffic solely on port 80/443 from ALB security group).</li>
          <li><strong>Stateless Network ACLs:</strong> Act as secondary subnet-boundary firewalls to filter malicious IP ranges and block unexpected protocol access.</li>
        </ul>

        <h4>3. VPC Peering & Transit Routing</h4>
        <p>For cross-account services, non-overlapping CIDR ranges (e.g., <code>10.0.0.0/16</code> peered with <code>10.1.0.0/16</code>) enable high-throughput, private AWS backbone communication without exposing endpoints to the public internet.</p>
      `
    },
    'blue-green': {
      category: 'CI/CD & Containers',
      title: 'Zero-Downtime Blue-Green Deployment with Docker, Nginx & GitHub Actions',
      content: `
        <div class="article-callout-box">
          <p><strong>Goal:</strong> Eliminate downtime and user disruption during application releases through containerized blue-green environments and seamless reverse proxy routing.</p>
        </div>

        <h4>1. Multi-Stage Dockerfile Optimization</h4>
        <p>To keep production containers lightweight and secure, we utilize a multi-stage build pattern that isolates the compile stage from the final minimal Alpine runtime image:</p>
        <ul>
          <li>Stage 1: Build source assets and dependencies in temporary builder environment.</li>
          <li>Stage 2: Copy only compiled production artifacts into a hardened, non-root Alpine container (reducing image footprint from 600MB+ down to &lt;40MB).</li>
        </ul>

        <h4>2. Hot-Reloading Nginx Upstreams</h4>
        <p>The host runs two identical application container clusters: <em>Blue (Port 8081)</em> and <em>Green (Port 8082)</em>.</p>
        <ul>
          <li>New code builds and launches into the inactive target container environment.</li>
          <li>Automated curl health check validates <code>HTTP 200 OK</code> on the newly launched container.</li>
          <li>GitHub Actions executes <code>nginx -s reload</code> to swap the upstream target without dropping existing active TCP connections.</li>
        </ul>

        <h4>3. Instant Rollback Safeguards</h4>
        <p>If any post-deployment smoke test fails, the workflow immediately triggers a reverse Nginx configuration reload back to the previous stable container in under 2 seconds.</p>
      `
    },
    'terraform-production': {
      category: 'Infrastructure as Code',
      title: 'Production Terraform: Remote S3 State, DynamoDB Locks & Modular Design',
      content: `
        <div class="article-callout-box">
          <p><strong>Best Practice:</strong> Never store Terraform state files locally in team environments. State corruption and concurrent writes must be actively prevented with distributed locks.</p>
        </div>

        <h4>1. Remote Backend Architecture</h4>
        <p>A production-ready Terraform setup begins with dedicated state backend provisioning:</p>
        <ul>
          <li><strong>AWS S3 Bucket:</strong> Stores encrypted <code>terraform.tfstate</code> with versioning enabled for state history recovery and rollback.</li>
          <li><strong>AWS DynamoDB Table:</strong> Uses a <code>LockID</code> string partition key to acquire distributed mutex locks whenever <code>terraform plan</code> or <code>terraform apply</code> runs.</li>
        </ul>

        <h4>2. Designing Parameterized Modules</h4>
        <p>Avoid monolithic Terraform scripts by organizing code into standalone, reusable modules:</p>
        <ul>
          <li><code>modules/vpc</code>: Provisions subnets, route tables, and gateways with configurable CIDRs.</li>
          <li><code>modules/security</code>: Encapsulates security group rules with dynamic port blocks.</li>
          <li><code>modules/compute</code>: Provisions launch templates and auto-scaling target groups.</li>
        </ul>

        <h4>3. Environment Parity</h4>
        <p>Terragrunt or clean folder hierarchies (<code>envs/dev</code>, <code>envs/staging</code>, <code>envs/prod</code>) inherit identical core modules while overriding instance sizes, replica counts, and monitoring thresholds safely.</p>
      `
    },
    'ccna-devops': {
      category: 'Networking & DevOps',
      title: 'CCNA to Cloud: Why Networking Fundamentals are a DevOps Superpower',
      content: `
        <div class="article-callout-box">
          <p><strong>The Bridge:</strong> In modern cloud and Kubernetes environments, applications communicate over complex virtualized overlay networks. Packet-level clarity turns vague connection errors into rapid root-cause resolutions.</p>
        </div>

        <h4>1. Translating CCNA to Cloud Networking</h4>
        <p>The networking foundations taught in Cisco CCNA directly power advanced Cloud and DevOps architectures:</p>
        <ul>
          <li><strong>VLSM & Subnetting:</strong> Enables precision VPC IP allocation without exhausting available IPs across microservices.</li>
          <li><strong>Routing Protocols (OSI Layer 3):</strong> Crucial for understanding AWS Transit Gateway route propagation, Direct Connect BGP peering, and Kubernetes Calico CNI routing.</li>
          <li><strong>TCP Handshakes & Keep-Alives (Layer 4):</strong> Essential for fine-tuning reverse proxy timeouts, load balancer idle connections, and WebSocket persistence.</li>
        </ul>

        <h4>2. Rapid Troubleshooting with Packet Analysis</h4>
        <p>DevOps engineers grounded in networking utilize standard diagnostics (<code>tcpdump</code>, <code>mtr</code>, <code>dig</code>, <code>curl -Iv</code>) to differentiate between DNS failure, Security Group drops, MTU blackholes, and application crashes within minutes.</p>
      `
    }
  };

  document.querySelectorAll('.read-article-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const articleKey = btn.getAttribute('data-article');
      const data = articleDetails[articleKey];

      if (data && articleModal && modalArticleTitle && modalArticleContent) {
        modalArticleCategory.textContent = data.category;
        modalArticleTitle.textContent = data.title;
        modalArticleContent.innerHTML = data.content;
        articleModal.classList.add('open');
      }
    });
  });

  if (closeArticleModal && articleModal) {
    closeArticleModal.addEventListener('click', () => {
      articleModal.classList.remove('open');
    });

    articleModal.addEventListener('click', (e) => {
      if (e.target === articleModal) {
        articleModal.classList.remove('open');
      }
    });
  }

  /* ==========================================================================
     11. Notification Bell & Dropdown Popover
     ========================================================================== */
  const notifBellBtn = document.getElementById('notif-bell-btn');
  const notifDropdown = document.getElementById('notif-dropdown');

  if (notifBellBtn && notifDropdown) {
    notifBellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!notifDropdown.contains(e.target) && e.target !== notifBellBtn) {
        notifDropdown.classList.remove('open');
      }
    });
  }

  /* ==========================================================================
     12. Dashboard & Events Top Banner Dismiss Handlers
     ========================================================================== */
  const closeEventAlert = document.getElementById('close-event-alert');
  const dashboardEventAlert = document.getElementById('dashboard-event-alert');
  if (closeEventAlert && dashboardEventAlert) {
    closeEventAlert.addEventListener('click', () => {
      dashboardEventAlert.style.display = 'none';
      sessionStorage.setItem('aajera_alert_dismissed', 'true');
    });

    if (sessionStorage.getItem('aajera_alert_dismissed') === 'true') {
      dashboardEventAlert.style.display = 'none';
    }
  }

  const dismissTopBanner = document.getElementById('dismiss-top-banner');
  const eventsTopBanner = document.getElementById('events-top-banner');
  if (dismissTopBanner && eventsTopBanner) {
    dismissTopBanner.addEventListener('click', () => {
      eventsTopBanner.style.display = 'none';
    });
  }

  /* ==========================================================================
     13. Events Page Search & Category Filter Engine (events.html)
     ========================================================================== */
  const eventSearchInput = document.getElementById('event-search-input');
  const eventPills = document.querySelectorAll('.events-pills-row .event-pill');
  const richEventCards = document.querySelectorAll('.events-grid-full .event-card-rich');

  function filterEvents() {
    const query = eventSearchInput ? eventSearchInput.value.toLowerCase().trim() : '';
    const activePill = document.querySelector('.events-pills-row .event-pill.active');
    const filterCat = activePill ? activePill.getAttribute('data-filter') : 'all';

    richEventCards.forEach((card) => {
      const categories = (card.getAttribute('data-category') || '').toLowerCase();
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const text = card.textContent.toLowerCase();

      const matchesCat = (filterCat === 'all') || categories.includes(filterCat);
      const matchesSearch = !query || text.includes(query) || tags.includes(query);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (eventPills.length > 0) {
    eventPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        eventPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        filterEvents();
      });
    });
  }

  if (eventSearchInput) {
    eventSearchInput.addEventListener('input', filterEvents);
  }

  /* ==========================================================================
     14. RSVP & Event Registration Modal Handlers
     ========================================================================== */
  const rsvpModal = document.getElementById('rsvp-modal');
  const closeRsvpModal = document.getElementById('close-rsvp-modal');
  const rsvpEventSelect = document.getElementById('rsvp-event-select');
  const modalRsvpTitle = document.getElementById('modal-rsvp-title');
  const rsvpForm = document.getElementById('rsvp-form');

  document.querySelectorAll('.rsvp-trigger-btn, #open-rsvp-top-btn, #hero-rsvp-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const eventTitle = btn.getAttribute('data-event-title') || 'AWS Cloud Practitioner & DevOps 3-Day Intensive Bootcamp';
      if (rsvpEventSelect) rsvpEventSelect.value = eventTitle;
      if (modalRsvpTitle) modalRsvpTitle.textContent = 'Register: ' + (eventTitle.length > 30 ? eventTitle.substring(0, 30) + '...' : eventTitle);
      if (rsvpModal) rsvpModal.classList.add('open');
    });
  });

  if (closeRsvpModal && rsvpModal) {
    closeRsvpModal.addEventListener('click', () => {
      rsvpModal.classList.remove('open');
    });

    rsvpModal.addEventListener('click', (e) => {
      if (e.target === rsvpModal) rsvpModal.classList.remove('open');
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('rsvp-submit-btn') || rsvpForm.querySelector('button[type="submit"]');
      const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';
      const rsvpStatus = document.getElementById('rsvp-status');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Submitting Registration...</span>';
      }

      if (rsvpStatus) rsvpStatus.innerHTML = '';

      const formData = new FormData(rsvpForm);
      const name = document.getElementById('rsvp-name') ? document.getElementById('rsvp-name').value : 'Attendee';

      try {
        const response = await fetch('https://formspree.io/f/xvkojzpr', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          showToast(`🎉 Registration request submitted for ${name}!`);
          if (rsvpStatus) {
            rsvpStatus.innerHTML = '<div class="form-status-success"><i class="fa-solid fa-circle-check"></i> Registration submitted! You will receive confirmation details shortly.</div>';
          }
          rsvpForm.reset();
          setTimeout(() => {
            if (rsvpModal) rsvpModal.classList.remove('open');
            if (rsvpStatus) rsvpStatus.innerHTML = '';
          }, 2000);
        } else {
          const data = await response.json().catch(() => ({}));
          const errorMsg = data && data.errors && data.errors.length
            ? data.errors.map((err) => err.message).join(', ')
            : 'Issue submitting registration request.';
          showToast('⚠️ ' + errorMsg);
          if (rsvpStatus) {
            rsvpStatus.innerHTML = `<div class="form-status-error"><i class="fa-solid fa-triangle-exclamation"></i> ${errorMsg}</div>`;
          }
        }
      } catch (err) {
        showToast('⚠️ Network issue submitting registration. Please try again.');
        if (rsvpStatus) {
          rsvpStatus.innerHTML = '<div class="form-status-error"><i class="fa-solid fa-triangle-exclamation"></i> Network error. Please try again.</div>';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnContent;
        }
      }
    });
  }

  /* ==========================================================================
     15. Event Syllabus Details Modal
     ========================================================================== */
  const syllabusModal = document.getElementById('syllabus-modal');
  const closeSyllabusModal = document.getElementById('close-syllabus-modal');
  const modalSyllabusCat = document.getElementById('modal-syllabus-cat');
  const modalSyllabusTitle = document.getElementById('modal-syllabus-title');
  const modalSyllabusContent = document.getElementById('modal-syllabus-content');

  const syllabusData = {
    'aws-bootcamp': {
      category: 'LIVEWIRE Salem · 3-Day Hands-on Workshop',
      title: 'AWS Cloud Practitioner & DevOps Intensive Bootcamp Syllabus',
      content: `
        <div class="article-callout-box">
          <p><strong>Format:</strong> 18 Hours (6 hours/day over 3 days) · 100% Practical Lab Sessions on AWS Free Tier & Docker Containers.</p>
        </div>
        <h4>Day 1: AWS Core Compute, Identity & IAM Security</h4>
        <ul>
          <li>AWS Global Infrastructure: Regions, Availability Zones & Edge Locations.</li>
          <li>IAM Users, Groups, Custom Policies, and Role-based Access Control (RBAC).</li>
          <li>EC2 Instance Provisioning, Key Pairs, Security Groups & User Data Scripts.</li>
          <li>Configuring Elastic Block Store (EBS) Volumes & S3 Object Storage buckets.</li>
        </ul>
        <h4>Day 2: Enterprise VPC Networking & High Availability</h4>
        <ul>
          <li>Architecting a Custom Multi-AZ VPC from scratch (Public & Private Subnets).</li>
          <li>Deploying Internet Gateways, NAT Gateways & Custom Route Tables.</li>
          <li>Setting up an Application Load Balancer (ALB) with Auto Scaling Groups (ASG).</li>
          <li>Network ACLs vs Security Groups packet-level filtering.</li>
        </ul>
        <h4>Day 3: Docker Containerization & Automated CI/CD Deployment</h4>
        <ul>
          <li>Containerizing a full-stack web application with optimized Dockerfiles.</li>
          <li>Deploying Docker containers on EC2 with Nginx Reverse Proxy.</li>
          <li>Writing GitHub Actions workflow YAML for automated test and deploy triggers.</li>
          <li>Final Capstone Project: Live deployed URL handed over to every participant.</li>
        </ul>
      `
    },
    'ccna-masterclass': {
      category: 'LIVEWIRE Salem · Weekend Masterclass Series',
      title: 'Cisco CCNA Networking & Topology Simulation Syllabus',
      content: `
        <div class="article-callout-box">
          <p><strong>Objective:</strong> Master foundational to advanced packet routing, IP addressing calculations, and switch configurations in Cisco Packet Tracer.</p>
        </div>
        <h4>Module 1: IPv4 VLSM & Subnetting Mastery</h4>
        <ul>
          <li>Binary-to-decimal conversions and CIDR prefix notation calculations.</li>
          <li>Variable Length Subnet Masking (VLSM) schema design for multi-branch networks.</li>
          <li>Private RFC 1918 addressing and Network Address Translation (NAT/PAT).</li>
        </ul>
        <h4>Module 2: Cisco IOS Switching, VLANs & Trunking</h4>
        <ul>
          <li>Cisco Switch initial configuration and SSH remote management security.</li>
          <li>Creating VLANs, Access Ports, and IEEE 802.1Q Trunk links.</li>
          <li>Inter-VLAN routing using Router-on-a-Stick and Layer 3 Switch SVIs.</li>
          <li>Spanning Tree Protocol (STP) convergence and loop prevention.</li>
        </ul>
        <h4>Module 3: Dynamic Enterprise Routing & ACL Security</h4>
        <ul>
          <li>Single-Area & Multi-Area OSPF configuration and metric calculations.</li>
          <li>Standard and Extended IPv4 Access Control Lists (ACLs).</li>
          <li>DHCP Server configuration and DNS relay agent forwarding.</li>
        </ul>
      `
    },
    'docker-lab': {
      category: 'Salem IT Lab Hub · Hands-on Masterclass',
      title: 'Docker Containers & Microservices Zero-to-One Lab Notes',
      content: `
        <div class="article-callout-box">
          <p><strong>Lab Scope:</strong> Practical containerization blueprints, microservice orchestration with Docker Compose, and persistent storage management.</p>
        </div>
        <h4>Key Lab Topics Covered:</h4>
        <ul>
          <li>Container lifecycle management (<code>run</code>, <code>exec</code>, <code>stop</code>, <code>prune</code>).</li>
          <li>Multi-stage Docker builds to reduce image attack surfaces and size by 90%.</li>
          <li>Named Volumes vs Bind Mounts for persistent databases.</li>
          <li>Docker Compose multi-service topology: Frontend + API + PostgreSQL + Nginx.</li>
        </ul>
      `
    },
    'career-keynote': {
      category: 'College Tech Symposium · Keynote Address',
      title: 'Breaking into Cloud & DevOps: Key Takeaways',
      content: `
        <div class="article-callout-box">
          <p><strong>Keynote Theme:</strong> Practical engineering roadmaps for fresh computer science graduates aiming for high-growth Cloud and DevOps positions.</p>
        </div>
        <h4>Core Recommendations for Undergrads:</h4>
        <ul>
          <li><strong>Master Linux & Git First:</strong> Shell scripting and Git workflow fluency are non-negotiable fundamentals.</li>
          <li><strong>Build Deployable Projects:</strong> Replace generic clone apps with automated, IaC-provisioned GitHub repositories with working live URLs.</li>
          <li><strong>Learn Networking Early:</strong> CCNA concepts (IP, DNS, TCP, Ports, Firewalls) will make cloud VPCs and Kubernetes intuitive.</li>
          <li><strong>Certifications as Accelerators:</strong> AWS Certified Cloud Practitioner / Solutions Architect Associate to validate foundational knowledge.</li>
        </ul>
      `
    },
    'telemetry-session': {
      category: 'Periyar University · Research Presentation',
      title: 'Cloud Telemetry & Anomaly Detection Presentation Summary',
      content: `
        <div class="article-callout-box">
          <p><strong>Topic:</strong> Bridging Data Science time-series analytics with CloudWatch and Prometheus infrastructure telemetry for proactive Site Reliability.</p>
        </div>
        <h4>Research Highlights:</h4>
        <ul>
          <li>Collecting high-frequency CPU, memory, IOPS, and network latency metrics via CloudWatch Agent.</li>
          <li>Training seasonal ARIMA and anomaly detection algorithms on historical operational logs.</li>
          <li>Real-time automated incident escalation via SNS triggers and webhook dispatchers.</li>
        </ul>
      `
    },
    'women-in-tech': {
      category: 'Salem Women in STEM · Mentorship Circle',
      title: 'Women in Tech Mentorship Circle Highlights',
      content: `
        <div class="article-callout-box">
          <p><strong>Mission:</strong> Building technical confidence, hands-on lab capabilities, and networking avenues for women entering Cloud and Infrastructure engineering.</p>
        </div>
        <h4>Program Pillars:</h4>
        <ul>
          <li>Weekly guided hands-on AWS lab assignments and peer code reviews.</li>
          <li>Resume transformation clinics and technical mock interviews.</li>
          <li>Direct mentorship on overcoming technical obstacles and imposter syndrome.</li>
        </ul>
      `
    }
  };

  document.querySelectorAll('.view-syllabus-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const eventId = btn.getAttribute('data-event-id');
      const data = syllabusData[eventId];

      if (data && syllabusModal && modalSyllabusTitle && modalSyllabusContent) {
        if (modalSyllabusCat) modalSyllabusCat.textContent = data.category;
        modalSyllabusTitle.textContent = data.title;
        modalSyllabusContent.innerHTML = data.content;
        syllabusModal.classList.add('open');
      }
    });
  });

  if (closeSyllabusModal && syllabusModal) {
    closeSyllabusModal.addEventListener('click', () => {
      syllabusModal.classList.remove('open');
    });

    syllabusModal.addEventListener('click', (e) => {
      if (e.target === syllabusModal) syllabusModal.classList.remove('open');
    });
  }

  /* ==========================================================================
     16. Unified Toast Notification
     ========================================================================== */
  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = msg;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Welcome announcement toast if on index.html and not dismissed
  if (document.getElementById('dashboard-event-alert') && !sessionStorage.getItem('aajera_alert_dismissed')) {
    setTimeout(() => {
      showToast('📢 Live Event Alert: AWS & DevOps Bootcamp announced at LIVEWIRE Salem!');
    }, 1500);
  }
});
