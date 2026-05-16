type Lookup = Map<string, HTMLImageElement>;

function getSlugs(): string[] {
  const links = document.querySelectorAll<HTMLAnchorElement>("a[data-painting-slug]");
  return Array.from(links).map((a) => a.dataset.paintingSlug!);
}

function buildLookup(): Lookup {
  const map: Lookup = new Map();
  document
    .querySelectorAll<HTMLImageElement>("[data-lb-sources] img[data-slug]")
    .forEach((img) => map.set(img.dataset.slug!, img));
  return map;
}

class Lightbox {
  private dialog: HTMLDialogElement;
  private container: HTMLElement;
  private slugs: string[] = [];
  private lookup: Lookup = new Map();
  private current = -1;
  private originatingThumb: HTMLAnchorElement | null = null;
  // True after we've pushed at least one history entry this session, so
  // closing can safely history.back() without navigating off-site when the
  // user deep-linked into a thumbnail page from elsewhere.
  private pushedThisSession = false;
  private touchStartX = 0;
  private touchStartY = 0;
  private touchActive = false;

  constructor(dialog: HTMLDialogElement) {
    this.dialog = dialog;
    this.container = dialog.querySelector<HTMLElement>("[data-lb-image-container]")!;
    this.slugs = getSlugs();
    this.lookup = buildLookup();
    this.attachGalleryHandlers();
    this.attachDialogHandlers();
    this.attachKeyboardHandlers();
    this.attachPointerHandlers();
    this.attachPopstateHandler();
  }

  private attachGalleryHandlers() {
    document.querySelectorAll<HTMLAnchorElement>("a[data-painting-slug]").forEach((a) => {
      a.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        this.originatingThumb = a;
        this.openSlug(a.dataset.paintingSlug!, true);
      });
    });
  }

  private attachDialogHandlers() {
    this.dialog
      .querySelector<HTMLButtonElement>("[data-lb-close]")
      ?.addEventListener("click", () => this.dialog.close());
    this.dialog
      .querySelector<HTMLButtonElement>("[data-lb-prev]")
      ?.addEventListener("click", () => this.step(-1));
    this.dialog
      .querySelector<HTMLButtonElement>("[data-lb-next]")
      ?.addEventListener("click", () => this.step(1));
    this.dialog.addEventListener("click", (e) => {
      if (e.target === this.dialog) this.dialog.close();
    });
    this.dialog.addEventListener("close", () => {
      document.documentElement.style.overflow = "";
      this.originatingThumb?.focus();
      // Pop the lightbox URL we pushed in openSlug() so closing restores
      // the previous URL. Only safe if we pushed in this session — otherwise
      // history.back() would navigate the user off the site.
      if (this.pushedThisSession && history.state?.lb) {
        this.pushedThisSession = false;
        history.back();
      }
    });
  }

  private attachKeyboardHandlers() {
    this.dialog.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.step(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        this.step(1);
      }
    });
  }

  private attachPointerHandlers() {
    this.container.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "touch") return;
      // iOS edge-swipe guard: ignore pointerdowns within 20px of the left
      // edge so the system back-swipe still works.
      if (e.clientX < 20) return;
      this.touchStartX = e.clientX;
      this.touchStartY = e.clientY;
      this.touchActive = true;
    });
    this.container.addEventListener("pointerup", (e) => {
      if (!this.touchActive) return;
      this.touchActive = false;
      const dx = e.clientX - this.touchStartX;
      const dy = e.clientY - this.touchStartY;
      if (Math.abs(dy) > Math.abs(dx)) return;
      if (Math.abs(dx) < 50) return;
      this.step(dx > 0 ? -1 : 1);
    });
  }

  private attachPopstateHandler() {
    window.addEventListener("popstate", () => this.syncFromUrl());
  }

  private syncFromUrl() {
    const m = location.pathname.match(/^\/paintings\/(\d{3})\/?$/);
    if (m && this.slugs.includes(m[1])) {
      this.openSlug(m[1], false);
    } else if (this.dialog.open) {
      this.dialog.close();
    }
  }

  private openSlug(slug: string, push: boolean) {
    const i = this.slugs.indexOf(slug);
    if (i === -1) return;
    this.current = i;
    this.swapImage(slug);
    if (!this.dialog.open) {
      document.documentElement.style.overflow = "hidden";
      this.dialog.showModal();
    }
    if (push) {
      history.pushState({ lb: true }, "", `/paintings/${slug}`);
      this.pushedThisSession = true;
    }
    this.preloadNeighbors();
  }

  private step(delta: number) {
    const i = this.current + delta;
    if (i < 0 || i >= this.slugs.length) return;
    this.current = i;
    const slug = this.slugs[i];
    this.swapImage(slug);
    history.replaceState({ lb: true }, "", `/paintings/${slug}`);
    this.preloadNeighbors();
  }

  private swapImage(slug: string) {
    const src = this.lookup.get(slug);
    if (!src) return;
    this.container.innerHTML = "";
    const clone = src.cloneNode(true) as HTMLImageElement;
    clone.removeAttribute("data-slug");
    clone.removeAttribute("hidden");
    clone.classList.add("max-h-full", "max-w-full", "object-contain");
    this.container.appendChild(clone);
  }

  private preloadNeighbors() {
    [-1, 1].forEach((d) => {
      const i = this.current + d;
      if (i < 0 || i >= this.slugs.length) return;
      const src = this.lookup.get(this.slugs[i]);
      if (src && src.srcset) {
        const probe = new Image();
        probe.srcset = src.srcset;
        probe.sizes = src.sizes;
      }
    });
  }
}

const dialog = document.querySelector<HTMLDialogElement>("#lightbox");
if (dialog) new Lightbox(dialog);
