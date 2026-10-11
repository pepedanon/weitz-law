
      (function () {
        "use strict";

        /* ----- Wall of love: sample testimonials (design placeholders) ----- */
        var reviews = [
          { text: "Zack rebuilt our entire estate plan and explained every decision in plain English. For the first time, we actually understand what we signed.", who: "Margaret H.", matter: "Estate planning client · Encino" },
          { text: "When my siblings contested our father's trust, Zack kept the case focused and civil — and got it resolved without years in court.", who: "Daniel R.", matter: "Trust litigation client · Los Angeles" },
          { text: "The IRS audit I dreaded for two years ended with a fraction of the original assessment. I only wish I had called him sooner.", who: "Priya S.", matter: "Tax controversy client · Pasadena" },
          { text: "As a trustee, I was overwhelmed by the deadlines and duties. Zack's step-by-step guidance made the whole administration manageable.", who: "Tom W.", matter: "Trust administration client · Glendale" },
          { text: "He structured our foundation properly from day one and handles our 990-PF every year. Impeccable, start to finish.", who: "The A. Family Foundation", matter: "Charitable & nonprofit client · Beverly Hills" },
          { text: "Our cross-border reporting was a mess of missed forms and penalties. Zack untangled it and negotiated the penalties down dramatically.", who: "Claude B.", matter: "International tax client · Santa Monica" },
          { text: "Straight answers, fair billing, and a plan that actually fits how our family business runs. A rare combination.", who: "George & Lena M.", matter: "Business tax client · Sherman Oaks" },
          { text: "After my mother passed, Zack handled the probate with patience and zero surprises. He treated us like people, not a file.", who: "Angela T.", matter: "Probate client · Burbank" },
          { text: "The Franchise Tax Board claimed we owed six figures. Zack's response strategy reduced it to almost nothing.", who: "Robert K.", matter: "Tax controversy client · Woodland Hills" },
          { text: "He reviewed the trust my parents created in the 90s and found gaps that could have cost us dearly under Prop 19. Now we're protected.", who: "Susan L.", matter: "Estate planning client · Studio City" },
          { text: "Professional, responsive, and genuinely discreet. Exactly what you want when family and money are both on the table.", who: "James D.", matter: "Asset protection client · Calabasas" },
          { text: "Zack represented me as a beneficiary when the trustee wouldn't communicate. Within months, I had a full accounting and my distribution.", who: "Nadia F.", matter: "Trust litigation client · Tarzana" }
        ];
        var wall = document.getElementById("wall");
        var frag = document.createDocumentFragment();
        reviews.forEach(function (r, i) {
          var card = document.createElement("article");
          card.className = "review rv" + (i % 3 === 1 ? " rv-d1" : i % 3 === 2 ? " rv-d2" : "");
          card.innerHTML =
            '<div class="stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>' +
            "<p></p>" +
            '<footer><div class="who"></div><div class="matter"></div></footer>';
          card.querySelector("p").textContent = "\u201C" + r.text + "\u201D";
          card.querySelector(".who").textContent = r.who;
          card.querySelector(".matter").textContent = r.matter;
          frag.appendChild(card);
        });
        wall.appendChild(frag);

        /* ----- Mobile menu (full-screen overlay) ----- */
        var btn = document.getElementById("menuBtn");
        var nav = document.getElementById("mainNav");
        function setMenu(open) {
          nav.classList.toggle("open", open);
          btn.setAttribute("aria-expanded", open ? "true" : "false");
          btn.textContent = open ? "Close" : "Menu";
          document.body.classList.toggle("menu-open", open);
          document.documentElement.classList.toggle("menu-open", open);
          /* Never leave the Ask Counsel panel open behind the menu. */
          if (open && typeof setChat === "function" && typeof chatOpen !== "undefined" && chatOpen) {
            setChat(false);
          }
        }
        btn.addEventListener("click", function () {
          setMenu(!nav.classList.contains("open"));
        });
        nav.addEventListener("click", function (e) {
          if (e.target.closest("a")) setMenu(false);
        });
        document.addEventListener("keydown", function (e) {
          if (e.key === "Escape" && nav.classList.contains("open")) {
            setMenu(false);
            btn.focus();
          }
        });
        window.addEventListener("resize", function () {
          if (window.innerWidth > 900 && nav.classList.contains("open")) setMenu(false);
        });

        /* ----- Reveal on scroll (progressive enhancement) -----
           Content is fully visible by default. Nothing is hidden until the
           reader actually starts scrolling; only then are below-fold blocks
           armed, and the observer fades them in as they approach. Print and
           full-page captures (which never scroll) always see full content. */
        var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var armed = [];
        var revealIO = null;
        function revealAll() {
          armed.forEach(function (el) { el.classList.add("snap"); el.classList.add("in"); });
        }
        /* Arm below-fold reveal blocks inside one scope (the whole document
           on scroll, or a single view when it becomes visible). Hidden views
           measure at 0, so their blocks simply stay unarmed until shown. */
        function armInScope(scope) {
          if (!revealIO || !scope) return;
          scope.querySelectorAll(".rv").forEach(function (el) {
            if (el.tagName === "A") return;
            if (el.classList.contains("rv-armed") || el.classList.contains("in")) return;
            if (el.getBoundingClientRect().top > window.innerHeight * 0.92) {
              el.classList.add("rv-armed");
              armed.push(el);
              revealIO.observe(el);
            }
          });
        }
        if (!reduceMotion && "IntersectionObserver" in window) {
          revealIO = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
              if (en.isIntersecting) { en.target.classList.add("in"); revealIO.unobserve(en.target); }
            });
          }, { threshold: 0.1, rootMargin: "0px 0px -4% 0px" });
          window.addEventListener("scroll", function () { armInScope(document); }, { passive: true });
          if (window.scrollY > 40) armInScope(document);
          window.setTimeout(revealAll, 5000);
          var startH = window.innerHeight;
          window.addEventListener("resize", function () {
            if (window.innerHeight > startH * 1.6) revealAll();
          });
          window.addEventListener("beforeprint", revealAll);
        }

        /* ----- Subtle parallax ----- */
        var pEls = document.querySelectorAll("[data-parallax]");
        if (!reduceMotion && pEls.length) {
          var ticking = false;
          function update() {
            ticking = false;
            pEls.forEach(function (el) {
              var host = el.parentElement.getBoundingClientRect();
              if (host.bottom < 0 || host.top > window.innerHeight) return;
              var speed = parseFloat(el.getAttribute("data-parallax")) || 0.25;
              var offset = (host.top + host.height / 2 - window.innerHeight / 2) * -speed * 0.35;
              el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
            });
          }
          window.addEventListener("scroll", function () {
            if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
          }, { passive: true });
          window.addEventListener("resize", update);
          update();
        }

        /* ----- Page router (hash-routed views in one document) -----
           "#/about" style hashes switch views; plain "#practice" style
           anchors land on whichever view contains the target element. */
        var viewEls = {
          home: document.getElementById("view-home"),
          about: document.getElementById("view-about"),
          attorney: document.getElementById("view-attorney"),
          questions: document.getElementById("view-questions"),
          contact: document.getElementById("view-contact"),
          "estate-planning": document.getElementById("view-estate-planning"),
          "trust-administration": document.getElementById("view-trust-administration"),
          "trust-litigation": document.getElementById("view-trust-litigation"),
          "tax-controversy": document.getElementById("view-tax-controversy"),
          "international-tax": document.getElementById("view-international-tax"),
          "charitable-nonprofit": document.getElementById("view-charitable-nonprofit"),
          "business-real-estate": document.getElementById("view-business-real-estate")
        };
        var viewTitles = {
          home: "Weitz Law — Estate Planning, Trust Litigation & Tax Law | Sherman Oaks, CA",
          about: "About the Firm — Weitz Law PC | Sherman Oaks, CA",
          attorney: "Zachary Weitz, Esq. — Weitz Law PC | Sherman Oaks, CA",
          questions: "Common Questions — Weitz Law PC | Sherman Oaks, CA",
          contact: "Contact Weitz Law PC | Sherman Oaks, CA",
          "estate-planning": "Estate Planning — Weitz Law PC | Sherman Oaks, CA",
          "trust-administration": "Trust Administration — Weitz Law PC | Sherman Oaks, CA",
          "trust-litigation": "Trust & Estate Litigation — Weitz Law PC | Sherman Oaks, CA",
          "tax-controversy": "Tax Controversy (IRS / FTB) — Weitz Law PC | Sherman Oaks, CA",
          "international-tax": "International Tax — Weitz Law PC | Sherman Oaks, CA",
          "charitable-nonprofit": "Charitable & Nonprofit — Weitz Law PC | Sherman Oaks, CA",
          "business-real-estate": "Business, Real Estate & Asset Protection — Weitz Law PC | Sherman Oaks, CA"
        };
        var practiceNames = ["estate-planning", "trust-administration", "trust-litigation", "tax-controversy", "international-tax", "charitable-nonprofit", "business-real-estate"];
        var currentView = "home";
        function showView(name, anchorId) {
          if (!viewEls[name]) name = "home";
          currentView = name;
          Object.keys(viewEls).forEach(function (k) { viewEls[k].hidden = k !== name; });
          document.title = viewTitles[name];
          document.querySelectorAll("nav.main a[href^='#/']").forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#/" + name);
          });
          var paLink = document.querySelector("nav.main a.pa-link");
          if (paLink) paLink.classList.toggle("active", practiceNames.indexOf(name) !== -1);
          var target = anchorId ? document.getElementById(anchorId) : null;
          if (target) {
            target.scrollIntoView();
          } else {
            var root = document.documentElement;
            var prev = root.style.scrollBehavior;
            root.style.scrollBehavior = "auto";
            window.scrollTo(0, 0);
            root.style.scrollBehavior = prev;
          }
          window.dispatchEvent(new Event("resize"));
          armInScope(viewEls[name]);
        }
        function routeFromHash() {
          var h = window.location.hash || "";
          if (h.indexOf("#/") === 0) { showView(h.slice(2) || "home"); return; }
          if (h.length > 1 && h.charAt(0) === "#") {
            var id = h.slice(1);
            var el = document.getElementById(id);
            if (el) {
              var view = el.closest(".view");
              showView(view ? view.id.replace("view-", "") : "home", id);
            }
          }
        }
        window.addEventListener("hashchange", routeFromHash);
        routeFromHash();

        /* ----- Practice cards and arc CTAs pre-select the matter ----- */
        document.querySelectorAll("[data-matter]").forEach(function (row) {
          row.addEventListener("click", function () {
            var v = row.getAttribute("data-matter");
            document.querySelectorAll('select[name="matter"]').forEach(function (sel) { sel.value = v; });
          });
        });

        /* ----- Consultation forms -> mailto (home + contact page) ----- */
        document.querySelectorAll("form.consult").forEach(function (form) {
          var toggle = form.querySelector(".more-toggle");
          var moreField = form.querySelector(".more-field");
          if (toggle && moreField) {
            toggle.addEventListener("click", function () {
              var open = moreField.hidden;
              moreField.hidden = !open;
              toggle.setAttribute("aria-expanded", open ? "true" : "false");
              toggle.textContent = open ? "Hide details" : "Add a few details (optional)";
              if (open) {
                var ta = moreField.querySelector("textarea");
                if (ta) ta.focus();
              }
            });
          }
          form.addEventListener("submit", function (e) {
            e.preventDefault();
            var name = form.querySelector('[name="name"]').value.trim();
            var email = form.querySelector('[name="email"]').value.trim();
            var matter = form.querySelector('[name="matter"]').value;
            var msgEl = form.querySelector('[name="message"]');
            var msg = msgEl ? msgEl.value.trim() : "";
            var consent = form.querySelector('[name="consent"]').checked;
            if (!name || !email || !matter || !consent) {
              form.reportValidity();
              return;
            }
            var subject = "Consultation Request — " + matter;
            var body =
              "Name: " + name + "\n" +
              "Email: " + email + "\n" +
              "Matter: " + matter + "\n" +
              "Consent to email/text communications: Yes\n\n" +
              msg;
            window.location.href =
              "mailto:zack@weitzlawesq.com?subject=" + encodeURIComponent(subject) +
              "&body=" + encodeURIComponent(body);
            var sent = form.parentElement.querySelector(".form-sent");
            if (sent) sent.style.display = "block";
          });
        });

        /* ----- Ask Counsel chat (design concept) ----- */
        var chatPanel = document.getElementById("chatPanel");
        var chatLaunch = document.getElementById("chatLaunch");
        var chatClose = document.getElementById("chatClose");
        var chatBody = document.getElementById("chatBody");
        var chatForm = document.getElementById("chatForm");
        var chatInput = document.getElementById("chatInput");
        var chatOpen = false;

        function setChat(open) {
          chatOpen = open;
          chatLaunch.setAttribute("aria-expanded", open ? "true" : "false");
          if (open) {
            chatPanel.hidden = false;
            window.requestAnimationFrame(function () {
              window.requestAnimationFrame(function () {
                chatPanel.classList.add("open");
                chatInput.focus();
              });
            });
          } else {
            chatPanel.classList.remove("open");
            window.setTimeout(function () {
              if (!chatOpen) chatPanel.hidden = true;
            }, 300);
          }
        }
        chatLaunch.addEventListener("click", function () { setChat(!chatOpen); });
        chatClose.addEventListener("click", function () { setChat(false); });
        document.addEventListener("keydown", function (e) {
          if (e.key === "Escape" && chatOpen) setChat(false);
        });

        /* Lightweight intake flow: qualify by area, one follow-up, then
           route to the consultation form. Never answers legal questions. */
        var intakeAreas = [
          { key: "estate", label: "Estate planning" },
          { key: "litigation", label: "Trust litigation" },
          { key: "tax", label: "Tax controversy" }
        ];
        var intakeFollowups = {
          estate: {
            q: "Planning ahead — wise. One quick question so the firm can prepare: is this a new plan, or an update to an existing one?",
            chips: ["A new plan", "Updating an existing plan", "Not sure yet"]
          },
          litigation: {
            q: "I&rsquo;m sorry you&rsquo;re dealing with that — these disputes are rarely easy. To route you to the right conversation: what is your role in the matter?",
            chips: ["Beneficiary", "Trustee or fiduciary", "Family member"]
          },
          tax: {
            q: "Tax notices carry deadlines, so timing matters. Which authority is involved?",
            chips: ["The IRS", "Franchise Tax Board", "Not sure yet"]
          }
        };
        var chatStage = "area";
        var currentChips = [];
        var chipsEl = document.getElementById("chatChips");

        function addChatMsg(text, who) {
          var div = document.createElement("div");
          div.className = "chat-msg " + who;
          div.textContent = text;
          chatBody.insertBefore(div, chipsEl);
          chatBody.scrollTop = chatBody.scrollHeight;
          return div;
        }
        function botSay(html, after) {
          var reply = addChatMsg("…", "bot");
          window.setTimeout(function () {
            reply.innerHTML = html;
            chatBody.scrollTop = chatBody.scrollHeight;
            if (after) after();
          }, 550);
        }
        function showChips(list) {
          currentChips = list;
          chipsEl.innerHTML = "";
          list.forEach(function (item) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "chat-chip";
            b.textContent = item.label;
            b.addEventListener("click", function () { pickChip(item); });
            chipsEl.appendChild(b);
          });
          chatBody.scrollTop = chatBody.scrollHeight;
        }
        function areaChips() {
          return intakeAreas.map(function (a) {
            return { label: a.label, action: "area", key: a.key };
          });
        }
        function pickChip(item) {
          addChatMsg(item.label, "user");
          chipsEl.innerHTML = "";
          if (item.action === "consult") {
            botSay("The consultation form is right here on the page — three short fields, and everything you share is held in confidence. I&rsquo;ll take you to it now.", function () {
              window.setTimeout(function () {
                setChat(false);
                if (currentView !== "home") {
                  window.location.hash = "#consult";
                } else {
                  document.getElementById("consult").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
                }
                window.setTimeout(function () { document.getElementById("f-name").focus(); }, reduceMotion ? 60 : 800);
              }, 900);
            });
            chatStage = "done";
            return;
          }
          if (item.action === "reset") {
            botSay("Of course. Which area best describes your matter?", function () {
              showChips(areaChips());
            });
            chatStage = "area";
            return;
          }
          if (chatStage === "area" && item.action === "area") {
            var f = intakeFollowups[item.key];
            botSay(f.q, function () {
              showChips(f.chips.map(function (c) { return { label: c, action: "follow" }; }));
            });
            chatStage = "follow";
            return;
          }
          if (chatStage === "follow") {
            botSay("Thank you — that&rsquo;s enough for the firm to prepare. The right next step is a confidential consultation: a few details in the form, and the firm follows up personally.", function () {
              showChips([
                { label: "Request a consultation", action: "consult" },
                { label: "Start over", action: "reset" }
              ]);
            });
            chatStage = "done";
          }
        }
        showChips(areaChips());

        chatForm.addEventListener("submit", function (e) {
          e.preventDefault();
          var text = chatInput.value.trim();
          if (!text) return;
          chatInput.value = "";
          addChatMsg(text, "user");
          chipsEl.innerHTML = "";
          if (chatStage === "done") {
            botSay("If you&rsquo;d like, tap &ldquo;Request a consultation&rdquo; and the firm will take it from there — or email zack@weitzlawesq.com directly.", function () {
              showChips(currentChips);
            });
          } else {
            botSay("I can&rsquo;t advise on the specifics here — that&rsquo;s exactly what the consultation is for. To get you routed correctly, which of these is closest?", function () {
              showChips(currentChips);
            });
          }
        });
        /* ----- FAQ accordion (one open at a time) ----- */
        var faqBtns = Array.prototype.slice.call(document.querySelectorAll(".faq-q"));
        function faqPanel(btn) {
          return document.getElementById(btn.getAttribute("aria-controls"));
        }
        function faqSet(btn, open) {
          var panel = faqPanel(btn);
          btn.setAttribute("aria-expanded", open ? "true" : "false");
          if (panel) panel.style.height = open ? panel.scrollHeight + "px" : "0px";
        }
        function faqRecalc() {
          faqBtns.forEach(function (b) {
            if (b.getAttribute("aria-expanded") === "true") {
              var p = faqPanel(b);
              if (p) p.style.height = p.scrollHeight + "px";
            }
          });
        }
        faqBtns.forEach(function (btn) {
          btn.addEventListener("click", function () {
            var wasOpen = btn.getAttribute("aria-expanded") === "true";
            faqBtns.forEach(function (b) { faqSet(b, false); });
            if (!wasOpen) faqSet(btn, true);
          });
        });
        if (faqBtns.length) faqSet(faqBtns[0], true);
        window.addEventListener("resize", faqRecalc);
        window.addEventListener("load", faqRecalc);

      })();
