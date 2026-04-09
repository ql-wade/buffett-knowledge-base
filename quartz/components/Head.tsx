import { i18n } from "../i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"
import { CustomOgImagesEmitterName } from "../plugins/emitters/ogImage"

function buildJsonLd(cfg: GlobalConfiguration, fileData: QuartzComponentProps["fileData"], title: string, description: string, socialUrl: string) {
  const baseUrl = cfg.baseUrl ?? "example.com"
  const schemas: Record<string, unknown>[] = []
  const slug = fileData.slug ?? ""

  // WebSite + Organization schema (homepage only)
  if (slug === "index") {
    schemas.push({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `https://${baseUrl}/#organization`,
          name: "beatwade",
          url: `https://${baseUrl}`,
          sameAs: ["https://github.com/ql-wade"],
        },
        {
          "@type": "WebSite",
          "@id": `https://${baseUrl}/#website`,
          name: cfg.pageTitle,
          url: `https://${baseUrl}`,
          description: description,
          inLanguage: "zh-CN",
          publisher: { "@id": `https://${baseUrl}/#organization` },
          potentialAction: {
            "@type": "SearchAction",
            target: `https://${baseUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        },
      ],
    })
  }

  // Article schema for all content pages
  if (slug !== "index" && slug !== "404") {
    const articleSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description: description,
      url: socialUrl,
      inLanguage: "zh-CN",
      author: {
        "@type": "Organization",
        name: "beatwade",
        url: `https://${baseUrl}`,
      },
      publisher: {
        "@type": "Organization",
        name: "beatwade",
        url: `https://${baseUrl}`,
      },
    }

    const created = fileData.frontmatter?.created
    const modified = fileData.frontmatter?.modified || fileData.frontmatter?.lastmod
    if (created) articleSchema.datePublished = created
    if (modified) articleSchema.dateModified = modified

    const keywords = fileData.frontmatter?.keywords || fileData.frontmatter?.tags
    if (keywords) {
      const kwArray = Array.isArray(keywords) ? keywords : [keywords]
      articleSchema.keywords = kwArray.join(", ")
    }

    schemas.push(articleSchema)
  }

  // FAQPage schema — highest priority for AI search (GEO)
  // Reads faq frontmatter: faq: [{q: "问题", a: "答案"}, ...]
  const faqItems = fileData.frontmatter?.faq as Array<{ q: string; a: string }> | undefined
  if (faqItems && faqItems.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    })
  }

  // BreadcrumbList schema — helps AI understand site hierarchy
  if (slug !== "index" && slug !== "404") {
    const parts = slug.split("/")
    const breadcrumbItems = [
      {
        "@type": "ListItem",
        position: 1,
        name: "首页",
        item: `https://${baseUrl}`,
      },
    ]
    const categoryNames: Record<string, string> = {
      finance: "金融投资",
      psychology: "心理认知",
      business: "商业管理",
      philosophy: "哲学",
      tech: "技术思维",
      history: "历史文化",
      scifi: "科幻",
      biography: "传记",
      "deep-analysis": "深度分析",
    }
    if (parts.length >= 1 && categoryNames[parts[0]]) {
      breadcrumbItems.push({
        "@type": "ListItem",
        position: 2,
        name: categoryNames[parts[0]],
        item: `https://${baseUrl}/${parts[0]}`,
      })
    }
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems,
    })
  }

  return schemas.map((s) => ({ __html: JSON.stringify(s) }))
}

export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title =
      (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    const description =
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")

    // Url of current page
    const socialUrl =
      fileData.slug === "404" ? url.toString() : joinSegments(url.toString(), fileData.slug!)

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`

    // Build JSON-LD structured data
    const jsonLdSchemas = buildJsonLd(cfg, fileData, title, description, socialUrl)

    // Extract keywords for meta tag
    const keywords = fileData.frontmatter?.keywords || fileData.frontmatter?.tags
    const kwString = keywords
      ? (Array.isArray(keywords) ? keywords : [keywords]).join(", ")
      : undefined

    // Build canonical URL
    const canonicalUrl = socialUrl.endsWith("/") ? socialUrl.slice(0, -1) : socialUrl

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={canonicalUrl} />

        <meta name="og:site_name" content={cfg.pageTitle}></meta>
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={description} />

        {/* AI Search & SEO enhanced meta tags */}
        <meta name="description" content={description} />
        {kwString && <meta name="keywords" content={kwString} />}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        {fileData.frontmatter?.created && <meta property="article:published_time" content={fileData.frontmatter.created} />}
        {fileData.frontmatter?.category?.[0] && <meta property="article:section" content={fileData.frontmatter.category[0]} />}
        {kwString && <meta property="article:tag" content={kwString} />}

        {/* JSON-LD Structured Data for AI Search (GEO) */}
        {jsonLdSchemas.map((schema, i) => (
          <script
            key={`jsonld-${i}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={schema}
          />
        ))}

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta name="twitter:image" content={ogImageDefaultPath} />
            <meta
              property="og:image:type"
              content={`image/${getFileExtension(ogImageDefaultPath) ?? "png"}`}
            />
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl}></meta>
            <meta property="og:url" content={socialUrl}></meta>
            <meta property="twitter:url" content={socialUrl}></meta>
          </>
        )}

        <link rel="icon" href={iconPath} />
        <meta name="generator" content="Quartz" />

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
