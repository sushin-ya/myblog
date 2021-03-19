/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faGithubSquare,
  faTwitterSquare,
} from "@fortawesome/free-brands-svg-icons"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  return (
    <div className="bio">
      <StaticImage
        className="bio-avatar"
        layout="fixed"
        formats={["AUTO", "WEBP", "AVIF"]}
        src="../images/profile-pic.png"
        width={100}
        height={100}
        quality={95}
        alt="Profile picture"
      />
      <div className="bio-content">
        {author?.name && (
          <>
            <p>
              <strong>{author.name}</strong>(@tsuka_ryu)
            </p>
            <p>{author?.summary || null}</p>
            <div>
              <a
                href={`https://github.com/tsuka-ryu`}
                style={{ textDecoration: "none" }}
              >
                <FontAwesomeIcon
                  icon={faGithubSquare}
                  className="fa-2x"
                  style={{
                    marginTop: "5px",
                    marginRight: "5px",
                    color: "#171515",
                  }}
                />
              </a>
              <a
                href={`https://twitter.com/${social?.twitter || ``}`}
                style={{ textDecoration: "none" }}
              >
                <FontAwesomeIcon
                  icon={faTwitterSquare}
                  className="fa-2x"
                  style={{
                    marginTop: "5px",
                    marginRight: "5px",
                    color: "#1DA1F2",
                  }}
                />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Bio
