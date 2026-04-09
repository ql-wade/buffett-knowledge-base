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

  // WebSite schema (only on homepage)
  if (fileData.slug === "index") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: cfg.pageTitle,
      url: `https://${baseUrl}`,
      description: description,
      inLanguage: "zh-CN",
      potentialAction: {
        "@type": "SearchAction",
        target: `https://${baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    })
  }

  // Article schema for all content pages
  if (fileData.slug !== "index" && fileData.slug !== "404") {
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

    // Add date if available
    const created = fileData.frontmatter?.created
    const modified = fileData.frontmatter?.modified || fileData.frontmatter?.lastmod
    if (created) articleSchema.datePublished = created
    if (modified) articleSchema.dateModified = modified

    // Add keywords from frontmatter
    const keywords = fileData.frontmatter?.keywords || fileData.frontmatter?.tags
    if (keywords) {
      const kwArray = Array.isArray(keywords) ? keywords : [keywords]
      articleSchema.keywords = kwArray.join(", ")
    }

    schemas.push(articleSchema)
  }

  return schemas.length > 0
    ? schemas.map((s) => ({
        __html: JSON.stringify(s),
      }))
    : []
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
        <meta property="article:published_time" content={fileData.frontmatter?.created} />
        <meta property="article:section" content={fileData.frontmatter?.category?.[0]} />
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
