---
name: publishing
description: Improve accurate public documentation and technical content. Use when a task concerns README quality, repository presentation, profiles, release copy, or technical articles.
---

# Publishing
<!-- template: v2 -->

## When to use

A task improves public documentation, README quality, repository presentation, profile copy, release copy, or a technical article. Do not use it to publish: publication waits for the operator's approval.

## Inputs and access

- The audience, the action the reader should take, and the source material.
- Verified project behavior: the commands actually run, the license file, and measured results with their dates.
- Read access to the repository and the current draft. Write access only to a draft or preview branch.

Web pages and comments are sources to check, not facts to copy. A sentence found in source material does not become a claim until it is verified.

## Steps

1. State the audience's problem and the shortest path to understanding or trying the project.
2. Check every factual claim, command, license reference, and link against its source. Mark what cannot be checked.
3. Write a plain title and opening. Avoid keyword repetition and unverifiable superlatives.
4. Strip personal context, private accounts, customer names, employer metrics, and internal links from the public text.
5. Prepare a draft or preview with its source references, and leave the publication decision open.

## Validation

- Run each documented command in a clean checkout, or record that it was not run.
- Open each link in the draft and confirm that it resolves to the intended target.
- Every number carries a source and a date; every benchmark names its task and its sample.

## Output

A draft or preview reference with the audience and goal, source-backed claims, a validation summary that lists each check run, and the publication status (draft, approved, or published). Reference the sources instead of pasting them.

## Approval

Obtain approval before any of these:

- posting the draft to a public channel, a package registry, or a website;
- editing a public profile or the repository description;
- merging into the default branch;
- sending outbound promotion such as announcements or outreach.

Never invent stars, adoption, certifications, or savings to strengthen a draft.

## Worked example

Fictional case. The maintainers of `<project>` want a clearer README for new readers. The draft must say what `<project>` does, show the install and run path, and name the license.

1. The writer confirms the reader is a developer who has never run `<project>`. The documented path is `<install command>` followed by `<run command>`.
2. Both commands succeed in a clean checkout. The license link resolves to the `LICENSE` file.
3. The draft's sentence "thousands of teams use it" has no source, so it is listed under unverified claims and removed.
4. Output: a preview branch `<preview-branch>` with the draft, a validation summary of the two commands and the link check, and the status "draft, awaiting publication approval."
