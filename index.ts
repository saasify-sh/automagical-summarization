import summarizeImpl = require('text-summarization')
import isHtml = require('is-html')

interface SummarizationSentence {
  original: string
  listItem: number
  actual: string
  normalized: string
  tokenized: string[]
}

interface SummarizationItem {
  index: number
  sentence: SummarizationSentence[]
  liScore: number
  nodeScore: number
  readabilityScore: number
  attributionScore: number
  tfidfScore: number
  score: number
}

interface SummarizationOptions {
  html?: string
  text?: string
  title?: string
  minNumSentences?: number
  maxNumSentences?: number
  minImageWidth?: number
  minImageHeight?: number
  media?: boolean
  detailedAll?: boolean
}

interface SummarizationResult {
  title: string

  extractive: string[]
  abstractive?: string[]

  topItems?: SummarizationItem[]
  items?: SummarizationItem[]
}

/**
 * Summarizes the given `input` text or HTML using a variety of signals.
 *
 * @param input - Text or HTML to summarize.
 * @param title - Title of `input` content.
 * @param numSentences - Optional number of sentences to produce. Default is to
 * infer a reasonable number based on the input's length.
 * @param minNumSentences - Optional minimum number of sentences to produce.
 * @param maxNumSentences - Optional maximum number of sentences to produce.
 * @param minImageWidth - Optional minimum image width when considering images in HTML.
 * @param minImageHeight - Optional minimum image height when considering images in HTML.
 * @param media - Whether or not to consider source media during summarization.
 * @param debug - When enabled, returns more debugging info to see how the input
 * sentences were processed and scored. Defaults to `false` and only returns the
 * abstractive summary as an array or strings.
 */
export default async function summarize(
  input: string,
  title?: string,
  numSentences?: number,
  minNumSentences: number = 1,
  maxNumSentences: number = 1000,
  minImageWidth: number = 400,
  minImageHeight: number = 300,
  media: boolean = false,
  debug: boolean = false
): Promise<string[] | SummarizationResult> {
  const opts: SummarizationOptions = {
    title,
    minNumSentences,
    maxNumSentences,
    minImageWidth,
    minImageHeight,
    media
  }

  const isInputHtml = isHtml(input)
  if (isInputHtml) {
    opts.html = input
  } else {
    opts.text = input
  }

  if (debug) {
    opts.detailedAll = true
  }

  const result = await (summarizeImpl(opts) as Promise<SummarizationResult>)

  if (debug) {
    return result
  } else {
    return result.abstractive
  }
}
