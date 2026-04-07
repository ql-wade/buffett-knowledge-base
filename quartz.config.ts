import { QuartzConfig } from "./quartz/cfg"
 import * as Plugin from "./quartz/plugins"

 import * as Component from "./quartz/components"

 import { GlobalConfiguration } from "./quartz/components/config"

 const config: QuartzConfig = {
  configuration: {
    pageTitle: "巴菲特致股东信 · 知识库",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    locale: "zh-CN",
    baseUrl: "buffett.beatwade.cn",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    generateSocialImages: false,
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Noto Serif SC",
        body: "Noto Sans SC",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f1",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#d4361c",
          tertiary: "#e8a838",
          highlight: "rgba(255, 212, 78, 0.15)",
          textHighlight: "#fffcb6",
        },
        darkMode: {
          light: "#1e1e21",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebeb",
          secondary: "#e8564a",
          tertiary: "#e8a838",
          highlight: "rgba(255, 212, 78, 0.08)",
          textHighlight: "#b3aa7020",
        },
      },
    },
  } satisfies GlobalConfiguration,

  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({
        enableInHtmlEmbed: true,
      }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({
        markdownLinkResolution: "shortest",
        lazy: true,
        externalLinkIcon: true,
      }),
      Plugin.Description(),
      Plugin.Latex({
        renderEngine: "katex",
      }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
        rssLimit: 100,
        rssFullHtml: true,
        rssSlug: "index",
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      Plugin.CustomOgImages(),
    ],
  },
} satisfies QuartzConfig

export default config